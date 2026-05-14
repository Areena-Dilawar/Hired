import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import Job from "@/models/Job";
import User from "@/models/User";
import { auth } from "@/auth";

import { NextResponse } from "next/server";
import { sendApplicationEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/ratelimit";

export async function POST(req: Request): Promise<NextResponse> {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await checkRateLimit(`apply:${ip}`);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute." },
      { status: 429 }
    );
  }

  await connectDB();

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "seeker") {
    return NextResponse.json(
      { error: "Only job seekers can apply" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { jobId, resumeUrl, resumePublicId, coverLetter } = body;

  if (!jobId || !resumeUrl || !resumePublicId) {
    return NextResponse.json(
      { error: "jobId, resumeUrl and resumePublicId are required" },
      { status: 400 }
    );
  }

  const existing = await Application.findOne({
    job: jobId,
    applicant: session.user.id,
  });
  if (existing) {
    return NextResponse.json(
      { error: "You have already applied to this job" },
      { status: 409 }
    );
  }

  const [application, job] = await Promise.all([
    Application.create({
      job: jobId,
      applicant: session.user.id,
      resumeUrl,
      resumePublicId,
      coverLetter: coverLetter?.trim(),
    }),
    Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } }, { new: true })
      .populate("postedBy", "email name")
      .lean(),
  ]);

  if (job) {
    const employer = job.postedBy as unknown as {
      email: string;
      name: string;
    };
    const applicant = await User.findById(session.user.id).lean();
    if (employer?.email && applicant) {
      await sendApplicationEmail({
        employerEmail: employer.email,
        jobTitle: job.title,
        applicantName: applicant.name,
      }).catch(() => {});
    }
  }

  return NextResponse.json(application, { status: 201 });
}