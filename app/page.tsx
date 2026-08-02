import AppOverlay from "./components/AppOverlay";
import { UserPublic } from "./types/user";

const SDK_URL =
  process.env.NEXT_PUBLIC_SDK_URL ||
  "http://localhost:8000";

type Props = {
  user: UserPublic | null;
};

export default function Home({ user }: Props) {
  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8 flex flex-col items-center justify-center">
      <AppOverlay SDK_URL={SDK_URL} user={user} />
    </main>
  );
}
