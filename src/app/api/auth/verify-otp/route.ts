import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getPendingUser, deletePendingUser, storePendingUser } from "@/lib/otp";
import { checkRateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await checkRateLimit(`verify-otp:${ip}`);
  if (!success) {
    return NextResponse.json(
      { error: "Too many verification attempts. Please wait a minute." },
      { status: 429 }
    );
  }

  const { email, otp } = await req.json();
  if (!email || !otp) {
    return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
  }

  const pendingUser = await getPendingUser(email);
  if (!pendingUser) {
    return NextResponse.json(
      { error: "Verification session expired or not found. Please register again." },
      { status: 400 }
    );
  }

  if (pendingUser.otp !== otp.trim()) {
    pendingUser.attempts += 1;
    if (pendingUser.attempts >= 4) {
      await deletePendingUser(email);
      return NextResponse.json(
        { error: "Too many incorrect attempts. Verification session cancelled. Please sign up again." },
        { status: 400 }
      );
    }
    await storePendingUser(email, pendingUser);
    return NextResponse.json(
      { error: `Invalid OTP code. ${4 - pendingUser.attempts} attempts remaining.` },
      { status: 400 }
    );
  }

  // OTP Matches! Create user in MongoDB
  await connectDB();
  
  // Double-check just in case someone registered in parallel
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    await deletePendingUser(email);
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const user = await User.create({
    name: pendingUser.name,
    email: pendingUser.email,
    password: pendingUser.passwordHash, // already hashed
    role: pendingUser.role,
    company: pendingUser.company,
    isVerified: true, // Mark verified immediately!
  });

  await deletePendingUser(email);

  return NextResponse.json({
    success: true,
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  });
}
