"use client";
import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    const res = await fetch("/api/puzzle/admin");
    const data = await res.json();
    setUsers(data);
  };

  const resetAll = async () => {
    await fetch("/api/admin/reset", { method: "POST" });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <button
        onClick={resetAll}
        className="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Reset All
      </button>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200  text-black">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Completed At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i} className="border-b">
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">
                {u.completed_at
                  ? new Date(u.completed_at).toLocaleTimeString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
