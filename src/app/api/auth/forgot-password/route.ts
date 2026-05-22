import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { checkRateLimit } from "@/lib/ratelimit";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await checkRateLimit(`forgot-password:${ip}`);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute." },
      { status: 429 }
    );
  }

  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase().trim() });

  // Always return success even if user not found (prevents email enumeration)
  if (!user) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // Generate a random token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash it before storing in DB for security
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expiry to 1 hour from now
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpiry = resetTokenExpiry;
  await user.save();

  try {
    // Send the UNHASHED token via email
    await sendPasswordResetEmail({ to: user.email, token: resetToken });
  } catch (error: any) {
    console.error("Failed to send password reset email:", error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();
    return NextResponse.json(
      { error: "Failed to send reset email. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
