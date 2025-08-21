// /app/api/admin/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("puzzleDB");

  const users = await db
    .collection("answers")
    .find()
    .sort({ completed_at: 1 })
    .toArray();

  return NextResponse.json(users); // <-- array directly
}
