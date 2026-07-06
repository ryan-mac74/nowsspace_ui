"use client";

import { useState } from "react";
import SessionRoom from "@/components/SessionRoom";

export default function Home() {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    const params = new URLSearchParams(window.location.search);
    return params.get("room") || "";
  });

  const [userId, setUserId] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return localStorage.getItem("user") || "";
  });

  function joinRoom() {
    if (!roomId || !userId) {
      return;
    }

    localStorage.setItem("user", userId);
    window.history.replaceState(
      {},
      "",
      `/?room=${roomId}`
    );

    setJoined(true);
  }

  // JOIN SCREEN
  if (!joined) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center">
        <div className="bg-zinc-900 p-8 rounded-2xl w-100 border border-zinc-800">
          <input
            placeholder="Username"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full mb-4 p-3 rounded bg-zinc-800 text-white outline-none"
          />

          <input
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full mb-6 p-3 rounded bg-zinc-800 text-white outline-none"
          />

          <button
            onClick={joinRoom}
            className="w-full bg-blue-600 hover:bg-blue-500 transition p-3 rounded text-white"
          >
            Join Room
          </button>

          <button
            onClick={() => {
              const generated = crypto.randomUUID().slice(0, 8);
              setRoomId(generated);
            }}
            className="w-full mt-3 bg-zinc-800 hover:bg-zinc-700 transition p-3 rounded text-white"
          >
            Generate Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <SessionRoom
      roomId={roomId}
      userId={userId}
    />
  );
}
