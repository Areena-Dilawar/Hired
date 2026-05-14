import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import Application from "@/models/Application";
import cloudinary from "@/lib/cloudinary";
import { auth } from "@/auth";

import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  await connectDB();

  const job = await Job.findById(params.id)
    .populate("postedBy", "name company avatar")
    .lean();

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(job);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  await connectDB();

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const job = await Job.findById(params.id);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if (
    job.postedBy.toString() !== session.user.id &&
    session.user.role !== "admin"
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  const updated = await Job.findByIdAndUpdate(
    params.id,
    {
      title: body.title?.trim(),
      company: body.company?.trim(),
      location: body.location?.trim(),
      type: body.type,
      description: body.description?.trim(),
      requirements: body.requirements?.trim(),
      salary: body.salary?.trim(),
      skills: Array.isArray(body.skills) ? body.skills : [],
      isActive: body.isActive,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    },
    { new: true, runValidators: true }
  ).lean();

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  await connectDB();

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const job = await Job.findById(params.id);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if (
    job.postedBy.toString() !== session.user.id &&
    session.user.role !== "admin"
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const applications = await Application.find({ job: params.id });

  await Promise.all(
    applications.map((app) =>
      cloudinary.uploader.destroy(app.resumePublicId, {
        resource_type: "raw",
      })
    )
  );

  await Promise.all([
    Job.findByIdAndDelete(params.id),
    Application.deleteMany({ job: params.id }),
  ]);

  return NextResponse.json({ success: true });
}