"use client";

import useAuth from "./hooks/useAuth";
import OAuthHandler from "./auth/OAuthHandler";
import AppOverlay from "./components/AppOverlay";
import ChatContainer from "./components/containers/ChatContainer";

const SDK_URL =
  process.env.NEXT_PUBLIC_SDK_URL ||
  "http://localhost:8080";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  "ws://localhost:8080/ws";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col relative selection:bg-blue-600 selection:text-white">
      <OAuthHandler />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 md:px-8 w-full max-w-7xl mx-auto">
        <ChatContainer SDK_URL={SDK_URL} />
        <AppOverlay SDK_URL={SDK_URL} WS_URL={WS_URL} user={user} />
      </main>
    </div>
  );
}
