import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import { auth } from "@/auth";

import { NextResponse } from "next/server";

export async function GET(req: Request): Promise<NextResponse> {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(20, parseInt(searchParams.get("limit") ?? "10"));
  const search = searchParams.get("search")?.trim() ?? "";
  const type = searchParams.get("type") ?? "";
  const location = searchParams.get("location")?.trim() ?? "";
  const skills = searchParams.get("skills")?.split(",").filter(Boolean) ?? [];
  const sort = searchParams.get("sort") ?? "newest";
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = { isActive: true };

  if (search) query.$text = { $search: search };
  if (type) query.type = type;
  if (location) query.location = { $regex: location, $options: "i" };
  if (skills.length) query.skills = { $in: skills };

  const sortMap: Record<string, Record<string, unknown>> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    salary: { salary: -1 },
    ...(search ? { relevance: { score: { $meta: "textScore" } } } : {}),
  };

  const sortObj = sortMap[sort] ?? sortMap.newest;

  const projection = search ? { score: { $meta: "textScore" } } : {};

  const [jobs, total] = await Promise.all([
    Job.find(query, projection)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate("postedBy", "name company avatar")
      .lean(),
    Job.countDocuments(query),
  ]);

  return NextResponse.json({
    jobs,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      hasNext: skip + limit < total,
      hasPrev: page > 1,
    },
  });
}

export async function POST(req: Request): Promise<NextResponse> {
  await connectDB();

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "employer") {
    return NextResponse.json({ error: "Employers only" }, { status: 403 });
  }

  const body = await req.json();
  const required = ["title", "company", "location", "type", "description"];

  for (const field of required) {
    if (!body[field]?.trim()) {
      return NextResponse.json(
        { error: `${field} is required` },
        { status: 400 }
      );
    }
  }

  const job = await Job.create({
    title: body.title.trim(),
    company: body.company.trim(),
    location: body.location.trim(),
    type: body.type,
    description: body.description.trim(),
    requirements: body.requirements?.trim(),
    salary: body.salary?.trim(),
    skills: Array.isArray(body.skills) ? body.skills : [],
    postedBy: session.user.id,
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
  });

  return NextResponse.json(job, { status: 201 });
}