import { UserPublic } from "./types/users";
import AppOverlay from "./components/AppOverlay";
import ChatContainer from "./components/ChatContainer";

const SDK_URL =
  process.env.NEXT_PUBLIC_SDK_URL ||
  "http://localhost:8000";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  "ws://localhost:8000/ws";

type Props = {
  user: UserPublic | null;
};

export default function Home({ user }: Props) {
  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 flex flex-col items-center justify-center relative">
      {/* Chat Container */}
      <ChatContainer SDK_URL={SDK_URL} />

      {/* App Overlay */}
      <AppOverlay SDK_URL={SDK_URL} WS_URL={WS_URL} user={user} />
    </main>
  );
}
