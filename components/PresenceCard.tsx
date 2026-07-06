"use client";

import { UserPresence } from "@/lib/types";
import { store } from "@/lib/store";

type Props = {
    roomId: string;
    users: Record<string, UserPresence>;
    localUserId: string;
    followedUserId: string | null;
    onDisconnect: () => void;
};

export default function PresenceCard({ roomId, users, localUserId, followedUserId, onDisconnect }: Props) {
    return (
        <div className="fixed top-4 right-4 z-40 w-72 rounded-xl bg-zinc-900 border border-zinc-800 p-4 text-white shadow-2xl flex flex-col gap-4">
            <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                    Online Participants ({Object.keys(users).length})
                </h3>

                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                    {Object.values(users).map((user, index) => (
                        <div key={user.id || index} className="flex items-center justify-between py-1">
                            {/* User Info */}
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                    className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
                                    style={{ backgroundColor: user.color }}
                                />
                                <span className="text-sm font-medium text-zinc-200 truncate">
                                    @{user.username || user.id || "Anonymous"} {user.id === localUserId && "(You)"}
                                </span>
                            </div>

                            {/* Viewport Follow Button */}
                            {user.id && user.id !== localUserId && (
                                <button
                                    onClick={() => {
                                        const current = store.getFollowedUserId();
                                        store.setFollowedUserId(current === user.id ? null : user.id);
                                    }}
                                    className={`text-[11px] px-2 py-1 rounded transition shrink-0 ${followedUserId === user.id
                                        ? "bg-blue-600 font-semibold text-white"
                                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                        }`}
                                >
                                    {followedUserId === user.id ? "Following" : "Follow"}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Session Controls */}
            <div className="border-t border-zinc-800 pt-3 flex flex-col gap-2">
                <span className="text-[11px] text-zinc-500 font-mono bg-zinc-950/60 text-center py-1 rounded border border-zinc-800/80">
                    ROOM: {roomId}
                </span>
                <button
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}?room=${roomId}`)}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold py-2 rounded-lg transition"
                >
                    Copy Invite Link
                </button>
                <button
                    onClick={onDisconnect}
                    className="w-full bg-red-950/30 hover:bg-red-900/40 text-red-400 text-xs font-semibold py-2 rounded-lg border border-red-900/20 transition"
                >
                    Leave Current Session
                </button>
            </div>
        </div>
    );
}
