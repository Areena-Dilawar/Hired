import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import User from "@/models/User";
import { auth } from "@/auth";

import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  await connectDB();

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [job, user] = await Promise.all([
    Job.findById(params.id).lean(),
    User.findById(session.user.id).lean(),
  ]);

  if (!job || !user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: `You are a job matching AI. Analyze how well this candidate matches the job.

Job Title: ${job.title}
Company: ${job.company}
Job Type: ${job.type}
Required Skills: ${job.skills.join(", ")}
Description: ${job.description.substring(0, 600)}

Candidate Skills: ${user.skills?.join(", ") ?? "None listed"}
Candidate Bio: ${user.bio ?? "Not provided"}

Reply ONLY with valid JSON, no explanation:
{
  "score": <number 0-100>,
  "reason": "<one sentence summary>",
  "factors": {
    "skills": <number 0-100>,
    "experience": <number 0-100>,
    "location": <number 0-100>,
    "seniority": <number 0-100>
  }
}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 200,
  });

  const content = completion.choices[0]?.message?.content ?? "{}";

  try {
    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { score: 0, reason: "Could not compute match", factors: {} },
      { status: 200 }
    );
  }
}