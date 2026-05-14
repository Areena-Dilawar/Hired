import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { auth } from "@/auth";


export const runtime = "nodejs";

export async function POST(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Only PDF files are accepted" },
      { status: 422 }
    );
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File must be under 5MB" },
      { status: 422 }
    );
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const dataURI = `data:application/pdf;base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: "job-board/resumes",
    resource_type: "raw",
    public_id: `resume_${session.user.id}_${Date.now()}`,
    overwrite: false,
  });

  return NextResponse.json({
    url: result.secure_url,
    publicId: result.public_id,
  });
}