export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { name, answer } = await req.json();
    const now = Date.now();

    if (!name || !answer) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("puzzleDB"); // change if needed
    const answersCollection = db.collection("answers");

    // Check if already exists
    const existing = await answersCollection.findOne({ name });

    if (existing && existing.answered) {
      return NextResponse.json({ error: "Already answered" }, { status: 400 });
    }

    if (existing) {
      await answersCollection.updateOne(
        { name },
        { $set: { answer, answered: true, createdAt: now } }
      );
    } else {
      await answersCollection.insertOne({
        name,
        answer,
        answered: true,
        createdAt: now,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in POST /answers:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
