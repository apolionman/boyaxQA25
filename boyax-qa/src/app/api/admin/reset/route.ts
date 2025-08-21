import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    // Safely parse JSON; default to empty object if invalid
    const body = await req.json().catch(() => ({}));
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("puzzleDB");

    const answersCollection = db.collection("answers");
    const usersCollection = db.collection("users");

    // Reset the user's answer
    await answersCollection.updateOne(
      { name },
      { $set: { answer: null, answered: false, createdAt: null } }
    );

    // Reset the user's puzzle completion
    await usersCollection.updateOne(
      { name },
      { $set: { completedAt: null } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error resetting user:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
