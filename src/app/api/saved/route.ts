import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/auth";

import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
  await connectDB();

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { jobId, action } = await req.json();

  if (!jobId || !["save", "unsave"].includes(action)) {
    return NextResponse.json(
      { error: "jobId and action (save|unsave) are required" },
      { status: 400 }
    );
  }

  const update =
    action === "save"
      ? { $addToSet: { savedJobs: jobId } }
      : { $pull: { savedJobs: jobId } };

  await User.findByIdAndUpdate(session.user.id, update);

  return NextResponse.json({ success: true });
}

export async function GET(): Promise<NextResponse> {
  await connectDB();

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(session.user.id)
    .populate({
      path: "savedJobs",
      match: { isActive: true },
      select: "title company location type salary skills applicationCount createdAt",
    })
    .lean();

  return NextResponse.json(user?.savedJobs ?? []);
}