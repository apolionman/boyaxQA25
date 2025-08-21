"use client";

import { useState, useEffect } from "react";
import PuzzleBoard from "@/components/PuzzleBoard";
import { sliceImage } from "@/lib/sliceImage";

export default function Page() {
  const [username, setUsername] = useState<string>("");
  const [pieces, setPieces] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("username");
    if (name) setUsername(name);
  }, []);

  useEffect(() => {
    setLoading(true);
    // replace with your image path
    const imageUrl = "/paps.png";
    const rows = 4; // adjust as needed
    const cols = 3;

    sliceImage(imageUrl, rows, cols).then((urls) => {
    setPieces(urls);
    setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
      {loading ? (
        <div className="text-black text-xl">Loading puzzle...</div>
      ) : (
        <PuzzleBoard
          pieces={pieces}
          rows={4} // must match sliceImage rows
          cols={3} // must match sliceImage cols
          username={username}
        />
      )}
    </div>
  );
}
