import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { username, completed_at } = await req.json();

    if (!username || !completed_at) {
      return NextResponse.json(
        { error: "Missing username or completed_at" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("puzzleDB");
    const usersCollection = db.collection("users");

    // Check if user exists
    const user = await usersCollection.findOne({ name: username });

    if (!user) {
      // Insert new user with completion timestamp
      await usersCollection.insertOne({
        name: username,
        completedAt: completed_at,
      });
    } else if (!user.completedAt) {
      // Only record first completion
      await usersCollection.updateOne(
        { name: username },
        { $set: { completedAt: completed_at } }
      );
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Error recording puzzle completion:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
