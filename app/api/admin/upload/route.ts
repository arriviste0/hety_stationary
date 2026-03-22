import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || ".png";
  const filename = `${randomUUID()}${ext}`;
  const filepath = path.join(uploadDir, filename);
  await fs.writeFile(filepath, bytes);

  return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
}
