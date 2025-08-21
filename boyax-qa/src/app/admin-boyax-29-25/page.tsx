"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [puzzleActive, setPuzzleActive] = useState(false);
  const router = useRouter();

  const goToPuzzleAdmin = () => {
    router.push("/puzzle/admin-panel");
  };

  const fetchUsers = async () => {
    const res = await fetch("/api/admin");
    const data = await res.json();
    setUsers(data);
  };

  const resetUser = async (name: string) => {
    await fetch("/api/admin/reset", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    fetchUsers();
  };

  const resetAll = async () => {
    await fetch("/api/admin/reset-all", { method: "POST" });
    fetchUsers();
  };

  const togglePuzzle = async () => {
    // You can store this status in your DB if needed
    setPuzzleActive(!puzzleActive);

    // Optionally notify users that puzzle is active
    await fetch("/api/admin/puzzle-toggle", {
      method: "POST",
      body: JSON.stringify({ active: !puzzleActive }),
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button
        onClick={goToPuzzleAdmin}
        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-2xl font-semibold transition"
      >
        Puzzle Admin
      </button>
        <button
          onClick={togglePuzzle}
          className={`px-4 py-2 rounded-2xl font-semibold transition ${
            puzzleActive
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          }`}
        >
          {puzzleActive ? "Puzzle Active" : "Activate Puzzle"}
        </button>
        <button
          onClick={resetAll}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Reset All
        </button>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200  text-black">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Answer</th>
            <th className="p-2 border">Time (s)</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
        {users.map((u, i) => {
            let diffFormatted = "-";
            if (u.created_at) {
              const now = Date.now();
              let diff = now - u.created_at; // milliseconds

              const minutes = Math.floor(diff / 60000);
              const seconds = Math.floor((diff % 60000) / 1000);
              const millis = diff % 1000;

              diffFormatted = `${minutes}:${seconds.toString().padStart(2, "0")}.${millis
                .toString()
                .padStart(3, "0")}`;
            }
            return (
              <tr key={i} className="border-b">
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.answer || "-"}</td>
                <td className="p-2 border text-center">{diffFormatted}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => resetUser(u.name)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reset
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
