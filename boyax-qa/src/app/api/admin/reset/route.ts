import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  db.prepare("UPDATE answers SET answer = NULL, answered = 0, created_at = NULL WHERE name = ?")
    .run(name);
  return NextResponse.json({ success: true });
}
