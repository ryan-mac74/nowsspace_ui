"use client";

import { useEffect, useState } from "react";
import { ScrollState } from "@/lib/types";

type Props = {
    scrolls: Record<string, ScrollState>;
};

export default function ScrollLayer({ scrolls }: Props) {
    const [indicatorY, setIndicatorY] = useState<Record<string, number>>({});

    useEffect(() => {
        const computeScrollPercentages = () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const nextPositions: Record<string, number> = {};

            Object.entries(scrolls).forEach(([userId, scroll]) => {
                // Handle edge case (no scrollable content)
                if (docHeight <= 0) {
                    nextPositions[userId] = 0; // set to top of viewport
                    return;
                }

                // Normalize scroll values to the client's visual viewport percentage
                const percentage = scroll.y / docHeight;
                nextPositions[userId] = percentage * (window.innerHeight - 40);
            });

            setIndicatorY(nextPositions);
        };

        computeScrollPercentages();
        window.addEventListener("resize", computeScrollPercentages);

        return () => window.removeEventListener("resize", computeScrollPercentages);
    }, [scrolls]);

    return (
        <>
            {Object.entries(indicatorY).map(([userId, yPos]) => (
                <div
                    key={userId}
                    className="fixed right-0 z-40 transition-all duration-200 pointer-events-none flex items-center"
                    style={{
                        top: `${yPos}px`
                    }}
                >
                    {/* Tiny Arrow Indicator pointing to position */}
                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-blue-500" />
                    <div className="bg-blue-500 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-l shadow-lg">
                        @{userId.slice(0, 8)}
                    </div>
                </div>
            ))}
        </>
    );
}
