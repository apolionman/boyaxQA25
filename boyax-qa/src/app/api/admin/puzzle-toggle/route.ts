import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const row = db.prepare("SELECT value FROM settings WHERE key = ?").get("puzzleActive");
    const puzzleActive = row?.value === "true";
    return NextResponse.json({ puzzleActive });
  } catch (error) {
    console.error("Error fetching puzzle status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { active } = await req.json();
    if (typeof active !== "boolean") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    db.prepare("UPDATE settings SET value = ? WHERE key = ?").run(active.toString(), "puzzleActive");
    return NextResponse.json({ success: true, puzzleActive: active });
  } catch (error) {
    console.error("Error updating puzzle status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
