import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/ratelimit";
import { validateEmailRealness } from "@/lib/emailValidation";
import bcrypt from "bcryptjs";
import { generateOTP, storePendingUser } from "@/lib/otp";
import { sendRegisterOTPEmail } from "@/lib/email";

export async function POST(req: Request): Promise<NextResponse> {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await checkRateLimit(`register:${ip}`);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute." },
      { status: 429 }
    );
  }

  await connectDB();

  const body = await req.json();
  const { name, email, password, role, company } = body;

  if (!name?.trim() || !email?.trim() || !password || !role) {
    return NextResponse.json(
      { error: "Name, email, password and role are required" },
      { status: 400 }
    );
  }

  const emailValidation = await validateEmailRealness(email);
  if (!emailValidation.isValid) {
    return NextResponse.json(
      { error: emailValidation.error },
      { status: 400 }
    );
  }

  if (!["employer", "seeker"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  // Hash the password so it's not stored in plain text in Redis
  const hashedPassword = await bcrypt.hash(password, 12);

  // Generate OTP code
  const otp = generateOTP();

  // Store in Redis with 10-minute TTL
  await storePendingUser(email, {
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash: hashedPassword,
    role,
    company: role === "employer" ? company?.trim() : undefined,
    otp,
    attempts: 0,
  });

  // Send verification email
  try {
    await sendRegisterOTPEmail({ to: email.toLowerCase().trim(), otp });
  } catch (error: any) {
    console.error("Failed to send registration OTP email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send verification OTP email" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      status: "OTP_SENT",
      email: email.toLowerCase().trim(),
    },
    { status: 200 }
  );
}