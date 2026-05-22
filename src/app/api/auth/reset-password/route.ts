import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { checkRateLimit } from "@/lib/ratelimit";
import crypto from "crypto";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await checkRateLimit(`reset-password:${ip}`);
  if (!success) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute." },
      { status: 429 }
    );
  }

  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json(
      { error: "Token and new password are required" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters long" },
      { status: 400 }
    );
  }

  // Hash the incoming token to match what's in the DB
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  await connectDB();

  // Find user by hashed token, ensure it hasn't expired
  const user = await User.findOne({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpiry: { $gt: new Date() },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired reset token. Please request a new one." },
      { status: 400 }
    );
  }

  // Update password (the pre-save hook in User model will hash this plaintext password)
  user.password = password;
  
  // Clear the reset tokens
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  
  await user.save();

  return NextResponse.json({ success: true }, { status: 200 });
}
