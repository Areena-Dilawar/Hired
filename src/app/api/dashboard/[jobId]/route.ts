import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import Job from "@/models/Job";
import { auth } from "@/auth";

import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { jobId: string } }
): Promise<NextResponse> {
  await connectDB();

  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const job = await Job.findById(params.jobId).lean();
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }
  if (
    job.postedBy.toString() !== session.user.id &&
    session.user.role !== "admin"
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const applications = await Application.find({ job: params.jobId })
    .populate("applicant", "name email avatar skills bio")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ job, applications });
}