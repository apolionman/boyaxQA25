import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("puzzleDB"); // change db name if needed
    const settings = await db.collection("settings").findOne({ key: "puzzleActive" });

    return NextResponse.json({ puzzleActive: settings?.value ?? false });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ puzzleActive: false });
  }
}

export async function POST(req: Request) {
  try {
    const { active } = await req.json();

    const client = await clientPromise;
    const db = client.db("puzzleDB");

    await db.collection("settings").updateOne(
      { key: "puzzleActive" },
      { $set: { value: active } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, puzzleActive: active });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}
