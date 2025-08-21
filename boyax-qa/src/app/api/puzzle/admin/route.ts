import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  const users = db.prepare("SELECT * FROM users ORDER BY completed_at ASC").all();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  // reset all users and progress
  db.prepare("DELETE FROM puzzle_progress").run();
  db.prepare("UPDATE users SET completed_at = NULL").run();
  return NextResponse.json({ status: "ok" });
}
