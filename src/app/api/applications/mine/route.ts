import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import { auth } from "@/auth";

import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  await connectDB();

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const applications = await Application.find({ applicant: session.user.id })
    .populate({
      path: "job",
      select: "title company location type salary isActive",
    })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(applications);
}