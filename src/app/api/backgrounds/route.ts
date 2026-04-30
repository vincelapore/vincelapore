import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET() {
  const { blobs } = await list({ prefix: "backgrounds/" });

  const backgrounds = blobs
    .filter((b) => b.size > 0)
    .map((b) => {
      // Extract color from filename: e.g. "backgrounds/cult_d8d8d8.png" -> "#d8d8d8"
      const match = b.pathname.match(/_([0-9a-f]{6})\.\w+$/i);
      return { src: b.url, color: match ? `#${match[1]}` : "#1a1a1a" };
    });

  return NextResponse.json(backgrounds);
}
