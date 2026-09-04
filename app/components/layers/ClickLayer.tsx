"use client";

import { useEffect, useState } from "react";
import type { ClickState } from "../../types/action";

// Dedicated component for a single click
function ClickIndicator({ click }: { click: ClickState }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Asynchronously hide this specific dot after 1000ms
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className="fixed w-8 h-8 border-2 border-blue-400 rounded-full animate-ping pointer-events-none z-[99998]"
            style={{
                left: `${click.x - 16}px`,
                top: `${click.y - 16}px`
            }}
        />
    );
}

type Props = {
    clicks: Record<string, ClickState>;
};

export default function ClickLayer({ clicks }: Props) {
    return (
        <>
            {Object.entries(clicks).map(([userId, click]) => (
                // Since click.timestamp is in the key, if the same user clicks again,
                // React completely unmounts the old indicator and mounts a new one
                <ClickIndicator
                    key={`${userId}-${click.timestamp}`}
                    click={click}
                />
            ))}
        </>
    );
}
