"use client";

import type { UserPresence } from "../../types/action";

type Props = {
    users: Record<string, UserPresence>;
};

export default function PageLayer({ users }: Props) {
    return (
        <div className="fixed bottom-4 left-4 z-40 pointer-events-none flex flex-col gap-1.5 max-w-xs">
            {Object.entries(users).map(([userId, user]) => {
                // Only render if the user has a known page
                if (!user.page) {
                    return null;
                }

                return (
                    <div
                        key={userId}
                        className="bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-xs px-2.5 py-1.5 rounded-lg shadow-xl flex items-center gap-2"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="font-medium text-zinc-400">
                            @{user?.username || `guest.${user?.id}`}:
                        </span>
                        <span className="font-mono bg-zinc-950 px-1 py-0.5 rounded text-emerald-400 border border-emerald-950">
                            {user.page}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
