"use client";

import { ClickState } from "@/lib/types";

type Props = {
    clicks: Record<string, ClickState>;
};

export default function ClickLayer({ clicks }: Props) {
    return (
        <>
            {Object.entries(clicks).map(([userId, click]) => (
                <div
                    key={userId + click.timestamp}
                    className="fixed w-8 h-8 border-2 border-blue-400 rounded-full animate-ping pointer-events-none z-[99998]"
                    style={{
                        left: `${click.x - 16}px`,
                        top: `${click.y - 16}px`
                    }}
                />
            ))}
        </>
    );
}
