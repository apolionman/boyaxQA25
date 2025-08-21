"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AnswerPage() {
  const [answer, setAnswer] = useState("");
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [puzzleActive, setPuzzleActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem("username");
    if (name) setUsername(name);
  }, []);

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

  const handleSend = async () => {
    if (!answer.trim()) return;
    const res = await fetch("/api/answer", {
      method: "POST",
      body: JSON.stringify({ name: username, answer }),
    });
    if (res.ok) {
      setSubmitted(true);
    }
  };

  const goToPuzzle = () => {
    router.push("/puzzle");
  };

  if (submitted) {
    return (
      <div className=" bg-white h-screen w-screen relative overflow-hidden flex items-center justify-center">
        {/* Background video */}
        <video
          className="absolute w-[300px] object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/mp4/Confetti - Animation 01.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay (to soften video like Apple does) */}
        <div className="absolute bg-white"></div>

        {/* Foreground card */}
        <div className="relative z-10 p-8 rounded-2xl shadow-2xl bg-white/70 backdrop-blur-xl border border-white/40 text-center animate-fadeIn scale-95 hover:scale-100 transition-transform duration-300">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Thank you, <span className="text-blue-600">{username}</span>!
          </h2>
          <div className="text-gray-700">
            <p className="text-lg">Your answer:</p>
            <p className="mt-2 text-xl font-medium text-gray-900 italic">
              “{answer}”
            </p>
            <p className="text-lg">is submitted</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 relative overflow-hidden">
      <button
        onClick={goToPuzzle}
        disabled={!puzzleActive}
        className={`fixed top-5 right-5 z-50 px-4 py-2 rounded-2xl text-gray-900 font-semibold shadow-md transition-all duration-300
          ${puzzleActive 
            ? "bg-white/90 hover:bg-white/100 hover:shadow-lg cursor-pointer" 
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
      >
        Puzzle
      </button>
      <img
        src="/70th.png"
        className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10"
      />
      {/* Background video */}
      <video
        className="absolute inset-0 w-260 h-300 sm:w-full md:w-full  sm:h-full md:h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/mp4/IMG_5636.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* White overlay to keep card readable */}
      <div className="absolute inset-0 bg-white/70"></div>

      {/* Foreground card */}
      <div className="relative z-10 bg-white/20 p-6 rounded-xl shadow w-96 backdrop-blur-sm">
        <h1 className="text-xl text-black font-medium mb-4">
          Hi {username}, your answer:
        </h1>
        <input
          type="text"
          placeholder="Write your answer..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full text-black border rounded-lg px-3 py-2 mb-3"
        />
        <button
          onClick={handleSend}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
        >
          Send
        </button>
      </div>
    </div>
  );
}
