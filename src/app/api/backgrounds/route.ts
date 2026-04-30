import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET() {
  const { blobs } = await list({ prefix: "backgrounds/" });

  const backgrounds = blobs
    .filter((b) => b.size > 0)
    .map((b) => ({ src: b.url }));

  return NextResponse.json(backgrounds);
}
