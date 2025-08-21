import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  const { username, completed_at } = await req.json();

  // check if user exists
  let user = db
    .prepare("SELECT * FROM users WHERE name = ?")
    .get(username);

  if (!user) {
    const info = db
      .prepare("INSERT INTO users (name, completed_at) VALUES (?, ?)")
      .run(username, completed_at);
  } else if (!user.completed_at) {
    // only record first completion
    db.prepare("UPDATE users SET completed_at = ? WHERE name = ?").run(
      completed_at,
      username
    );
  }

  return NextResponse.json({ status: "ok" });
}
