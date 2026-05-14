import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Job from "@/models/Job";
import { NextResponse } from "next/server";
import { sendJobAlertEmail } from "@/lib/email";

export async function GET(req: Request): Promise<NextResponse> {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const subscribers = await User.find({
    alertEnabled: true,
    alertKeyword: { $exists: true, $ne: "" },
  }).lean();

  let sent = 0;

  await Promise.all(
    subscribers.map(async (user) => {
      if (!user.alertKeyword || !user.email) return;

      const jobs = await Job.find({
        $text: { $search: user.alertKeyword },
        isActive: true,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      })
        .limit(5)
        .lean();

      if (jobs.length > 0) {
        await sendJobAlertEmail({
          to: user.email,
          jobs: jobs.map((j) => ({
            title: j.title,
            company: j.company,
            _id: j._id.toString(),
          })),
          keyword: user.alertKeyword,
        }).catch(() => {});
        sent++;
      }
    })
  );

  return NextResponse.json({ success: true, sent });
}