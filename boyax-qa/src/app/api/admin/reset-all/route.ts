import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST() {
  db.prepare("UPDATE answers SET answer = NULL, answered = 0, created_at = NULL").run();
  return NextResponse.json({ success: true });
}
