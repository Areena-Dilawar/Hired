import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/ratelimit";

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

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role,
    company: role === "employer" ? company?.trim() : undefined,
  });

  return NextResponse.json(
    {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    { status: 201 }
  );
}