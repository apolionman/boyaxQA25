"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [name, setName] = useState("");
  const [step, setStep] = useState<"name" | "choice">("name");
  const [puzzleActive, setPuzzleActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch("/api/admin/puzzle-toggle");
      if (res.ok) {
        const data = await res.json();
        setPuzzleActive(data.puzzleActive);
      }
    };
    fetchStatus();
  }, []);

  const handleNameSubmit = () => {
    if (name.trim()) {
      localStorage.setItem("username", name); // store temporarily
      setStep("choice"); // go to choice step
    }
  };

  const handleChoice = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Logo */}
      <img
        src="/70th.png"
        className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10"
      />

      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/mp4/IMG_5636.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/70"></div>

      {/* Foreground card */}
      <div className="relative z-10 bg-white/20 p-6 rounded-xl shadow w-96 backdrop-blur-sm text-center">
        {step === "name" ? (
          <>
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">Welcome</h1>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border text-black rounded-lg px-3 py-2 mb-4 focus:ring focus:ring-blue-300"
            />
            <button
              onClick={handleNameSubmit}
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Hello, {name}! Choose an option:
            </h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleChoice("/answer")}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                QA / Answer
              </button>
              <button
                onClick={() => handleChoice("/puzzle")}
                disabled={!puzzleActive}
                className={`w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition
                ${puzzleActive 
                  ? "bg-green-600/90 hover:bg-white/100 hover:shadow-lg cursor-pointer" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Puzzle
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
