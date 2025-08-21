import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // important! loads .env.local
const MONGODB_URI="mongodb+srv://claudiuslawrence:C16lIUoyWsHlIdiQ@cluster0.kqolqya.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
async function test() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is undefined");
    return;
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log("✅ Connected to MongoDB successfully!");
    await client.close();
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

test();
