"use client";

import { useEffect, useRef } from "react";
import { useSocket } from "../hooks/useSocket";
import { store } from "../lib/store";
import { UserPublic } from "../types/users";
import PresenceCard from "../components/containers/PresenceCard";
import ChatPanel from "../components/containers/ChatPanel";
import CursorLayer from "../components/layers/CursorLayer";
import ScrollLayer from "../components/layers/ScrollLayer";
import ClickLayer from "../components/layers/ClickLayer";
import PageLayer from "../components/layers/PageLayer";
import HoverLayer from "../components/layers/HoverLayer";

type Props = {
    WS_URL: string;
    roomId: string;
    roomOwnerId: string;
    user: UserPublic;
    onLeave: () => void;
};

// Generate a selector from an element
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

export default function SessionRoom({
    WS_URL, roomId, roomOwnerId, user, onLeave
}: Props) {
    const { state, send } = useSocket(WS_URL, roomId, String(user.id));

    // Keep a stable reference to the "send" function for use in event listeners
    const sendRef = useRef(send);
    useEffect(() => {
        sendRef.current = send;
    }, [send]);

    useEffect(() => {
        const userColor = `#${Math.floor(
            Math.random() * 16777215
        ).toString(16).padStart(6, "0")}`;

        const uid = String(user.id);
        const name = user.name || `Guest ${uid}`;
        const username = user.username || `guest.${uid}`;

        // Add user to the store
        store.applyPatch({
            type: "state.patch",
            op: "set",
            path: `users.${uid}`,
            value: {
                id: uid,
                name: name,
                username: username,
                color: userColor,
                page: window.location.pathname,
            }
        });

        // Join the room on mount
        sendRef.current({
            id: crypto.randomUUID(),
            type: "presence.join",
            room: roomId,
            payload: {
                user_id: uid,
                name: name,
                username: username,
                color: userColor,
                page: window.location.pathname,
            }
        });

        return () => {
            // Leave the room on unmount
            sendRef.current({
                id: crypto.randomUUID(),
                type: "presence.leave",
                room: roomId,
                payload: {
                    user_id: uid,
                }
            });
        };
    }, [roomId, user]);

    useEffect(() => {
        const activeOutlines = new Map<string, HTMLElement>();

        // Track active target dimensions responsively
        Object.entries(state.hovers).forEach(([remoteUserId, hover]) => {
            if (!hover?.selector || (remoteUserId === String(user.id))) {
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
    }, [state.hovers, state.users, user]);

    useEffect(() => {
        let latestX = 0, latestY = 0;
        let lastSentX = -1, lastSentY = -1;
        let lastHover = "";

        const uid = String(user.id);

        const onMouseMove = (e: MouseEvent) => {
            latestX = e.clientX;
            latestY = e.clientY;

            const target = e.target as Element;

            // Track hover state for the element under the cursor
            if (target && (target.tagName !== "BODY") && (target.tagName !== "HTML")) {
                const selector = getElementSelector(target);

                if (selector && (selector !== lastHover)) {
                    // Send hover event to the server
                    sendRef.current({
                        id: crypto.randomUUID(),
                        type: "element.hover",
                        room: roomId,
                        payload: {
                            user_id: uid,
                            selector,
                        }
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
                payload: {
                    user_id: uid,
                    x: e.clientX,
                    y: e.clientY,
                    timestamp: Date.now(),
                }
            });
        };

        const onScroll = () => {
            // Send scroll event to the server
            sendRef.current({
                id: crypto.randomUUID(),
                type: "scroll.sync",
                room: roomId,
                payload: {
                    user_id: uid,
                    x: window.scrollX,
                    y: window.scrollY,
                }
            });
        };

        // Add event listeners to handle user actions
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("click", onClick, true);
        window.addEventListener("scroll", onScroll);

        const cursorInterval = setInterval(() => {
            if (
                (latestX === 0 && latestY === 0) ||
                (latestX === lastSentX && latestY === lastSentY)
            ) {
                return; // ignore empty cursor moves
            }

            lastSentX = latestX;
            lastSentY = latestY;

            // Send cursor move event to the server
            sendRef.current({
                id: crypto.randomUUID(),
                type: "cursor.move",
                room: roomId,
                payload: {
                    user_id: uid,
                    x: latestX,
                    y: latestY,
                }
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
                    payload: {
                        user_id: uid,
                        pathname: lastPage,
                    }
                });
            }
        }, 1000);

        return () => {
            // Remove event listeners on cleanup
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("click", onClick, true);
            window.removeEventListener("scroll", onScroll);

            clearInterval(cursorInterval);
            clearInterval(pageInterval);
        };
    }, [roomId, user]);

    const handlePassControl = (targetId: string) => {
        // Send room control event to the server
        sendRef.current({
            id: crypto.randomUUID(),
            type: "room.control",
            room: roomId,
            payload: {
                user_id: String(user.id),
                target_id: targetId,
            }
        });
    };

    return (
        <>
            <PresenceCard
                roomId={roomId}
                roomOwnerId={roomOwnerId}
                users={state.users}
                localUserId={String(user.id)}
                controllerId={state.controller_id}
                onPassControl={handlePassControl}
                onDisconnect={onLeave}
            />
            <ChatPanel
                roomId={roomId}
                userId={String(user.id)}
                users={state.users}
                messages={state.messages}
                send={send}
            />

            <div className="fixed inset-0 pointer-events-none z-[99990]">
                <CursorLayer users={state.users} cursors={state.cursors} />
                <ScrollLayer users={state.users} scrolls={state.scrolls} />
                <ClickLayer clicks={state.clicks} />
                <PageLayer users={state.users} />
                <HoverLayer hovers={state.hovers} />
            </div>
        </>
    );
}
