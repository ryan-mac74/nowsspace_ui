"use client";

import { useEffect, useState } from "react";
import { HoverState } from "@/lib/types";

type Props = {
    hovers: Record<string, HoverState>;
};

export default function HoverLayer({ hovers }: Props) {
    const [bounds, setBounds] = useState<Record<string, DOMRect>>({});

    // Track active target dimensions responsively
    useEffect(() => {
        const updateBounds = () => {
            const nextBounds: Record<string, DOMRect> = {};

            Object.entries(hovers).forEach(([userId, hover]) => {
                if (!hover?.selector) {
                    return;
                }

                try {
                    const el = document.querySelector(hover.selector);
                    if (el) {
                        // Store the bounding rectangle for the user's hover target
                        nextBounds[userId] = el.getBoundingClientRect();
                    }
                } catch (e) {
                    // Fail safely on un-parsable DOM selectors
                }
            });

            setBounds(nextBounds);
        };

        updateBounds();
        window.addEventListener("resize", updateBounds);
        window.addEventListener("scroll", updateBounds, true);

        return () => {
            window.removeEventListener("resize", updateBounds);
            window.removeEventListener("scroll", updateBounds, true);
        };
    }, [hovers]);

    return (
        <>
            {Object.entries(hovers).map(([userId, hover]) => {
                const rect = bounds[userId];
                if (!hover?.selector || !rect) {
                    return null;
                }

                return (
                    <div
                        key={userId + hover.selector}
                        className="fixed border border-yellow-400 bg-yellow-400/5 pointer-events-none z-30 transition-all duration-150 rounded"
                        style={{
                            left: `${rect.left}px`,
                            top: `${rect.top}px`,
                            width: `${rect.width}px`,
                            height: `${rect.height}px`
                        }}
                    />
                );
            })}
        </>
    );
}
