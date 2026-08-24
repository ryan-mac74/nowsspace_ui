"use client";

import { useEffect, useState } from "react";
import { UserPresence } from "../../types/action";

type Props = {
    users: Record<string, UserPresence>;
    cursors: Record<string, {
        x: number;
        y: number;
    }>;
};

export default function CursorLayer({ users, cursors }: Props) {
    const [smooth, setSmooth] = useState(cursors);

    useEffect(() => {
        const interval = setInterval(() => {
            setSmooth((prev) => {
                const next = { ...prev };

                Object.entries(cursors).forEach(([id, target]) => {
                    const current = prev[id] || target;

                    next[id] = {
                        x: current.x + (target.x - current.x) * 0.35,
                        y: current.y + (target.y - current.y) * 0.35
                    };
                });

                return next;
            });
        }, 16);

        return () => clearInterval(interval);
    }, [cursors]);

    return (
        <>
            {Object.entries(smooth).map(([userId, cursor]) => {
                const user = users[userId];
                if (!user) {
                    return null;
                }

                return (
                    <div
                        key={userId}
                        className="fixed pointer-events-none z-50 transition-transform"
                        style={{
                            transform: `translate(${cursor.x}px, ${cursor.y}px)`
                        }}
                    >
                        {/* SVG Pointer Arrow */}
                        <svg className="w-5 h-5 drop-shadow" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M4.5 3V17L9.2 12.3L15 18L18 15L12.3 9.2L17 4.5H4.5Z"
                                fill={user?.color || "#3B82F6"}
                            />
                        </svg>

                        {/* Name Badge Label */}
                        <div
                            className="px-2 py-0.5 rounded text-sm text-white ml-3 shadow-md font-medium whitespace-nowrap"
                            style={{
                                backgroundColor: user?.color || "#3B82F6"
                            }}
                        >
                            @{user?.username || `guest.${user?.id}`}
                        </div>
                    </div>
                );
            })}
        </>
    );
}
