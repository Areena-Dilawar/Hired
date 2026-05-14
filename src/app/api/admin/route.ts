import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import User from "@/models/User";
import Application from "@/models/Application";
import { auth } from "@/auth";

import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  await connectDB();

  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [totalJobs, totalUsers, totalApplications, recentJobs, recentUsers] =
    await Promise.all([
      Job.countDocuments(),
      User.countDocuments(),
      Application.countDocuments(),
      Job.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("postedBy", "name email")
        .lean(),
      User.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select("-password")
        .lean(),
    ]);

  return NextResponse.json({
    stats: { totalJobs, totalUsers, totalApplications },
    recentJobs,
    recentUsers,
  });
}

export async function DELETE(req: Request): Promise<NextResponse> {
  await connectDB();

  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!type || !id) {
    return NextResponse.json(
      { error: "type and id are required" },
      { status: 400 }
    );
  }

  if (type === "job") {
    await Promise.all([
      Job.findByIdAndDelete(id),
      Application.deleteMany({ job: id }),
    ]);
  } else if (type === "user") {
    await Promise.all([
      User.findByIdAndDelete(id),
      Job.deleteMany({ postedBy: id }),
      Application.deleteMany({ applicant: id }),
    ]);
  } else {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}