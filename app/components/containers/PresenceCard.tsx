"use client";

import { Crown, Radio } from "lucide-react";
import { UserPresence } from "../../types/action";
import Button from "../ui/Button";

type Props = {
    roomId: string;
    roomOwnerId: string;
    users: Record<string, UserPresence>;
    localUserId: string;
    controllerId: string | null;
    onPassControl: (targetId: string) => void;
    onDisconnect: () => void;
};

export default function PresenceCard({
    roomId, roomOwnerId, users, localUserId, controllerId,
    onPassControl, onDisconnect
}: Props) {
    const isOwner = localUserId === roomOwnerId;

    return (
        <div className="fixed top-4 right-4 z-40 w-80 rounded-xl bg-zinc-900 border border-zinc-800 p-4 text-white shadow-2xl flex flex-col gap-4 pointer-events-auto">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        Online Participants ({Object.keys(users).length})
                    </h3>

                    {/* Host Badge */}
                    {isOwner && (
                        <span
                            className="
                                flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-950/40 border 
                                border-amber-800/40 px-1.5 py-0.5 rounded
                            "
                        >
                            <Crown className="size-3" /> Host
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2 max-h-[100px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    {Object.values(users).map((user, index) => {
                        const uid = user?.id || String(index);
                        const isController = uid === controllerId;
                        const isLocalUser = uid === localUserId;

                        return (
                            <div
                                key={uid}
                                className="
                                    flex items-center justify-between py-1.5 px-2 rounded-lg bg-zinc-950/40 
                                    border border-zinc-800/50 transition-colors hover:border-zinc-700/60 shrink-0
                                "
                            >
                                {/* User Info */}
                                <div
                                    onClick={() => {
                                        if (isOwner && !isController) {
                                            onPassControl(uid);
                                        }
                                    }}
                                    className={`
                                        flex items-center gap-2.5 min-w-0 flex-1 
                                        ${isOwner && !isController
                                            ? "cursor-pointer group/user select-none"
                                            : ""
                                        }
                                    `}
                                    title={
                                        isOwner && !isController
                                            ? `Click to grant control to @${user?.username || `guest.${user?.id}`}`
                                            : undefined
                                    }
                                >
                                    <div
                                        className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
                                        style={{
                                            backgroundColor: user?.color || "#3B82F6",
                                        }}
                                    />

                                    <div className="flex flex-col min-w-0">
                                        <span
                                            className={`
                                                text-xs font-medium text-zinc-200 truncate 
                                                ${isOwner && !isController
                                                    ? "group-hover/user:text-blue-400 transition-colors"
                                                    : ""
                                                }
                                            `}
                                        >
                                            @{user?.username || `guest.${user?.id}`} {isLocalUser && "(You)"}
                                        </span>

                                        {/* Controller Badge */}
                                        {isController && (
                                            <span className="flex items-center gap-1 text-xs text-blue-400 font-medium">
                                                <Radio className="size-2.5 animate-pulse" /> In Control
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Room Owner Controls */}
                                {isOwner && (
                                    <div className="shrink-0 ml-2">
                                        {isController ? (
                                            <span
                                                className="
                                                    text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/40 
                                                    border border-emerald-800/40 px-2 py-1 rounded
                                                "
                                            >
                                                Active
                                            </span>
                                        ) : (
                                            <Button
                                                onClick={() => onPassControl(uid)}
                                                className="
                                                    text-xs px-2 py-1 bg-zinc-800 hover:bg-blue-600 
                                                    text-zinc-300 hover:text-white rounded transition
                                                "
                                            >
                                                {isLocalUser ? "Take Control" : "Pass Control"}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Reclaim Button */}
            {isOwner && controllerId && (controllerId !== localUserId) && (
                <Button
                    onClick={() => onPassControl(localUserId)}
                    className="
                        w-full bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 
                        border border-amber-500/30 text-xs font-semibold py-2 rounded-lg transition
                    "
                >
                    Reclaim Room Control
                </Button>
            )}

            {/* Session Controls */}
            <div className="border-t border-zinc-800 pt-3 flex flex-col gap-2">
                <span className="text-xs text-zinc-500 font-mono bg-zinc-950/60 text-center py-1 rounded border border-zinc-800/80">
                    ROOM: {roomId}
                </span>

                <Button
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}?room=${roomId}`)}
                    className="
                        w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 
                        text-xs font-semibold py-2 rounded-lg transition
                    "
                >
                    Copy Room Link
                </Button>

                <Button
                    onClick={onDisconnect}
                    className="
                        w-full bg-red-950/30 hover:bg-red-900/40 text-red-400 text-xs 
                        font-semibold py-2 rounded-lg border border-red-900/20 transition
                    "
                >
                    Leave Current Session
                </Button>
            </div>
        </div>
    );
}
