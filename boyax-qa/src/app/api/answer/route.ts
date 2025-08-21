export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  const { name, answer } = await req.json();
  const now = Date.now();

  const existing = db.prepare("SELECT * FROM answers WHERE name = ?").get(name);

  if (existing && existing.answered) {
    return NextResponse.json({ error: "Already answered" }, { status: 400 });
  }

  if (existing) {
    db.prepare(
      "UPDATE answers SET answer = ?, answered = 1, created_at = ? WHERE name = ?"
    ).run(answer, now, name);
  } else {
    db.prepare(
      "INSERT INTO answers (name, answer, answered, created_at) VALUES (?, ?, 1, ?)"
    ).run(name, answer, now);
  }

  return NextResponse.json({ success: true });
}
