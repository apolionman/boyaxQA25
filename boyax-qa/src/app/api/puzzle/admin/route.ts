import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET: fetch all users ordered by completion time
export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("puzzleDB");
    const usersCollection = db.collection("answers");

    const users = await usersCollection
      .find({})
      .sort({ completedAt: 1 }) // ascending
      .toArray();

    // Convert _id to string for frontend
    const formattedUsers = users.map(u => ({
      ...u,
      id: u._id.toString(),
    }));

    return NextResponse.json(formattedUsers);
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: reset all users and puzzle progress
export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("puzzleDB");

    // Clear puzzle progress
    const progressCollection = db.collection("puzzle_progress");
    await progressCollection.deleteMany({});

    // Reset users' completedAt
    const usersCollection = db.collection("users");
    await usersCollection.updateMany({}, { $set: { completedAt: null } });

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Error resetting puzzle:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
