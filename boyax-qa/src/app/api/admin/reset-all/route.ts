import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("puzzleDB"); // your DB name

    const answersCollection = db.collection("answers");
    const usersCollection = db.collection("users");

    // Reset all users' answers
    await answersCollection.updateMany(
      {},
      { $set: { answer: null, answered: false, createdAt: null, completedAt: null } }
    );

    // Reset all users' puzzle completion
    await usersCollection.updateMany(
      {},
      { $set: { completedAt: null } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error resetting all:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
