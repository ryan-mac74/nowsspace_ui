"use client";

import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { store } from "@/lib/store";
import PresenceCard from "@/components/PresenceCard";
import ChatPanel from "@/components/ChatPanel";
import CursorLayer from "@/components/CursorLayer";
import ScrollLayer from "@/components/ScrollLayer";
import ClickLayer from "@/components/ClickLayer";
import PageLayer from "@/components/PageLayer";
import HoverLayer from "@/components/HoverLayer";

type Props = {
    roomId: string;
    userId: string;
};

// To generate a selector from an element
function getElementSelector(el: Element): string {
    if (el.id) {
        return `#${el.id}`;
    }
    if (el.hasAttribute("data-id")) {
        return `[data-id="${el.getAttribute("data-id")}"]`;
    }

    const path = [];
    let current: Element | null = el;

    // Go up the DOM tree to build a unique selector path, 
    // but limit depth to avoid overly long selectors
    while (current && (current.nodeType === Node.ELEMENT_NODE) && (path.length < 3)) {
        const selector = current.nodeName.toLowerCase();
        if (current.id) {
            path.unshift(`${selector}#${current.id}`);
            break;
        }

        path.unshift(selector);
        current = current.parentElement;
    }

    return path.join(" > ");
}

export default function SessionRoom({ roomId, userId }: Props) {
    const { state, send } = useSocket(roomId, userId);
    const [followedUserId, setFollowedUserId] = useState<string | null>(null);

    // Keep a stable reference to the "send" function for use in event listeners
    const sendRef = useRef(send);
    useEffect(() => {
        sendRef.current = send;
    }, [send]);

    // Track local store changes for following indicators
    useEffect(() => {
        const checkFollowState = () => setFollowedUserId(store.getFollowedUserId());
        const unsubscribe = store.subscribe(checkFollowState);

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const userColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;

        // Add user to presence on mount
        sendRef.current({
            id: crypto.randomUUID(),
            type: "presence.join",
            room: roomId,
            payload: {
                user_id: userId,
                name: userId,
                username: userId,
                color: userColor,
                page: window.location.pathname,
            }
        });

        return () => {
            // Remove user from presence on unmount
            sendRef.current({
                id: crypto.randomUUID(),
                type: "presence.leave",
                room: roomId,
                payload: { user_id: userId }
            });
        };
    }, [roomId, userId]);

    useEffect(() => {
        const activeOutlines = new Map<string, HTMLElement>();

        // Track active target dimensions responsively
        Object.entries(state.hovers).forEach(([remoteUserId, hover]) => {
            if (!hover?.selector || (remoteUserId === userId)) {
                return;
            }

            try {
                const el = document.querySelector(hover.selector) as HTMLElement;
                if (el) {
                    const match = state.users[remoteUserId];
                    el.style.outline = `2px solid ${match?.color}`;

                    // Store the element reference for cleanup later
                    activeOutlines.set(remoteUserId, el);
                }
            } catch (e) {
                // Ignore invalid DOM selectors gracefully
            }
        });

        return () => {
            // Clear all outlines on cleanup
            activeOutlines.forEach(el => {
                if (el) {
                    el.style.outline = "";
                }
            });
        };
    }, [state.hovers, state.users, userId]);

    useEffect(() => {
        let latestX = 0, latestY = 0;
        let lastSentX = -1, lastSentY = -1;
        let lastHover = "";

        const onMouseMove = (e: MouseEvent) => {
            latestX = e.clientX;
            latestY = e.clientY;

            // Track hover state for the element under the cursor
            const target = e.target as Element;
            if (target && (target.tagName !== "BODY") && (target.tagName !== "HTML")) {
                const selector = getElementSelector(target);
                if (selector && (selector !== lastHover)) {
                    // Send hover event to the server
                    sendRef.current({
                        id: crypto.randomUUID(),
                        type: "element.hover",
                        room: roomId,
                        payload: { user_id: userId, selector }
                    });

                    lastHover = selector;
                }
            }
        };

        const onClick = (e: MouseEvent) => {
            // Send click event to the server
            sendRef.current({
                id: crypto.randomUUID(),
                type: "click.ping",
                room: roomId,
                payload: { user_id: userId, x: e.clientX, y: e.clientY, timestamp: Date.now() }
            });
        };

        const onScroll = () => {
            // Send scroll event to the server
            sendRef.current({
                id: crypto.randomUUID(),
                type: "scroll.sync",
                room: roomId,
                payload: { user_id: userId, x: window.scrollX, y: window.scrollY }
            });
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("click", onClick, true); // capture phase to catch clicks before they propagate
        window.addEventListener("scroll", onScroll);

        const cursorInterval = setInterval(() => {
            if ((latestX === 0 && latestY === 0) || (latestX === lastSentX && latestY === lastSentY)) {
                return;
            }

            lastSentX = latestX;
            lastSentY = latestY;

            // Send cursor move event to the server
            sendRef.current({
                id: crypto.randomUUID(),
                type: "cursor.move",
                room: roomId,
                payload: { user_id: userId, x: latestX, y: latestY }
            });
        }, 50);

        let lastPage = window.location.pathname;
        const pageInterval = setInterval(() => {
            if (window.location.pathname !== lastPage) {
                lastPage = window.location.pathname;

                // Send page change event to the server
                sendRef.current({
                    id: crypto.randomUUID(),
                    type: "page.change",
                    room: roomId,
                    payload: { user_id: userId, pathname: lastPage }
                });
            }
        }, 1000);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("click", onClick, true);
            window.removeEventListener("scroll", onScroll);

            clearInterval(cursorInterval);
            clearInterval(pageInterval);
        };
    }, [roomId, userId])

    // Handle leaving the session and redirecting to the homepage
    const handleLeaveSession = () => {
        window.location.href = window.location.origin;
    };

    return (
        <>
            <PresenceCard
                roomId={roomId}
                users={state.users}
                localUserId={userId}
                followedUserId={followedUserId}
                onDisconnect={handleLeaveSession}
            />
            <ChatPanel
                roomId={roomId}
                userId={userId}
                messages={state.messages}
                send={send}
            />

            <div className="fixed inset-0 pointer-events-none z-[99990]">
                <CursorLayer cursors={state.cursors} users={state.users} />
                <ScrollLayer scrolls={state.scrolls} />
                <ClickLayer clicks={state.clicks} />
                <PageLayer pages={state.pages} />
                <HoverLayer hovers={state.hovers} />
            </div>
        </>
    );
}
