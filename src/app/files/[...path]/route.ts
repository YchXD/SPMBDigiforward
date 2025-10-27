import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: filePathArr } = await context.params;
    const filePath = path.join(process.cwd(), "uploads", ...filePathArr);
    console.log("Mau baca:", filePath);

    let fileBuffer: Buffer;
    try {
      fileBuffer = await fs.readFile(filePath);
    } catch {
      if (process.env.VERCEL === "true") {
        const blobPath = filePathArr.join("/");
        const blobUrl = `https://ed5uvumrhqqw9cs3.public.blob.vercel-storage.com/uploads/${blobPath}`;
        console.log("Fetching blob:", blobUrl);

        const res = await fetch(blobUrl);
        if (!res.ok)
          throw new Error(`Blob fetch failed: ${res.status} ${res.statusText}`);
        const arrayBuffer = await res.arrayBuffer();
        fileBuffer = Buffer.from(arrayBuffer);
      } else {
        throw new Error("Local file not found and not running on Vercel.");
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    let contentType = "application/octet-stream";
    if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    if (ext === ".png") contentType = "image/png";
    if (ext === ".pdf") contentType = "application/pdf";

    return new NextResponse(fileBuffer as unknown as BodyInit, {
      status: 200,
      headers: { "Content-Type": contentType },
    });
  } catch (err: any) {
    console.error("File error:", err.message);
    return new Response("File not found", { status: 404 });
  }
}
