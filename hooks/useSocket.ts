"use client";

import { useEffect, useState, useRef } from "react";
import { store } from "@/lib/store";
import { AppState, AppEvent, PendingMessage } from "@/lib/types";

// Hook to handle WebSocket communication 
export function useSocket(roomId: string, userId: string) {
    const [state, setState] = useState<AppState>(store.getState());
    const wsRef = useRef<WebSocket | null>(null);
    const pendingRef = useRef<Map<string, PendingMessage>>(new Map());
    const lastSeqRef = useRef<number>(-1);

    // Subscribe to store updates and update local state accordingly
    useEffect(() => {
        const unsubscribe = store.subscribe((newState) => {
            setState(newState);
        });
        return () => unsubscribe();
    }, []);

    // Connect to the WebSocket server and handle incoming messages
    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8080/ws/${roomId}?user_id=${userId}`);
        wsRef.current = socket;

        socket.onopen = () => {
            console.log("Connected to WebSocket");
        };

        socket.onmessage = (e) => {
            const raw = JSON.parse(e.data);

            // Check for ACK messages to confirm delivery of sent events
            if (raw.type === "ack") {
                const id = raw.eventId;
                const entry = pendingRef.current.get(id);
                if (entry) {
                    entry.cancelled = true;
                    clearTimeout(entry.timeout);
                    pendingRef.current.delete(id);
                }
                return;
            }

            // Check for state snapshot messages
            if ((raw.type === "state.snapshot") && raw.payload) {
                console.log("ROOM SNAPSHOT:", raw.payload);

                Object.entries(raw.payload).forEach(([key, value]) => {
                    // Apply a patch to set the value in the store
                    store.applyPatch({
                        type: "state.patch",
                        op: "set",
                        path: key,
                        value: value
                    });
                });

                return;
            }

            // Check for state patch messages
            if (raw.type === "state.patch") {
                // Ignore out-of-order patches
                if ((raw.seq !== undefined) && (raw.seq < lastSeqRef.current)) {
                    return;
                }

                // Update last sequence number if provided
                if (raw.seq !== undefined) {
                    lastSeqRef.current = raw.seq;
                }

                store.applyPatch(raw);
                return;
            }

            const currentRoomState = store.getState();

            // Check for presence join events
            if ((raw.type === "presence.join") && raw.payload?.user_id) {
                const user = raw.payload;
                const exists = user.user_id in currentRoomState.users;
                if (!exists) {
                    // Apply a patch to add the new user to the store
                    store.applyPatch({
                        type: "state.patch",
                        op: "set",
                        path: `users.${user.user_id}`,
                        value: {
                            id: user.user_id,
                            username: user.username || user.user_id,
                            name: user.name || user.user_id,
                            color: user.color || "#3B82F6",
                            page: user.page || "/",
                        }
                    });
                }
            }

            // Check for presence leave events
            else if ((raw.type === "presence.leave") && raw.payload?.user_id) {
                const targetId = raw.payload.user_id;

                // Apply a patch to remove the user from the store
                store.applyPatch({
                    type: "state.patch",
                    op: "delete",
                    path: `users.${targetId}`
                });

                // Apply a patch to remove the user's cursor from the store
                store.applyPatch({
                    type: "state.patch",
                    op: "delete",
                    path: `cursors.${targetId}`
                });

                // Apply a patch to remove the user's scroll from the store
                store.applyPatch({
                    type: "state.patch",
                    op: "delete",
                    path: `scrolls.${targetId}`
                });

                // Apply a patch to remove the user's hover from the store
                store.applyPatch({
                    type: "state.patch",
                    op: "delete",
                    path: `hovers.${targetId}`
                });
            }

            // Check for chat message events
            else if ((raw.type === "chat.message") && raw.payload) {
                // Apply a patch to append the new message to the store
                store.applyPatch({
                    type: "state.patch",
                    op: "append",
                    path: "messages",
                    value: {
                        id: raw.payload.id || crypto.randomUUID(),
                        user_id: raw.payload.user_id,
                        message: raw.payload.message,
                    }
                });
            }

            // Check for cursor move events
            else if ((raw.type === "cursor.move") && raw.payload?.user_id) {
                // Apply a patch to set the cursor in the store
                store.applyPatch({
                    type: "state.patch",
                    op: "set",
                    path: `cursors.${raw.payload.user_id}`,
                    value: {
                        x: raw.payload.x,
                        y: raw.payload.y,
                    }
                });
            }

            // Check for scroll events
            else if ((raw.type === "scroll.sync") && raw.payload?.user_id) {
                // Apply a patch to set the scroll position in the store
                store.applyPatch({
                    type: "state.patch",
                    op: "set",
                    path: `scrolls.${raw.payload.user_id}`,
                    value: {
                        x: raw.payload.x,
                        y: raw.payload.y,
                    }
                });
            }

            // Check for click events
            else if ((raw.type === "click.ping") && raw.payload?.user_id) {
                // Apply a patch to set the click position in the store
                store.applyPatch({
                    type: "state.patch",
                    op: "set",
                    path: `clicks.${raw.payload.user_id}`,
                    value: {
                        x: raw.payload.x,
                        y: raw.payload.y,
                        timestamp: raw.payload.timestamp || Date.now(),
                    }
                });
            }

            // Check for hover events
            else if (raw.type === "element.hover" && raw.payload?.user_id) {
                // Apply a patch to set the hover selector in the store
                store.applyPatch({
                    type: "state.patch",
                    op: "set",
                    path: `hovers.${raw.payload.user_id}`,
                    value: {
                        selector: raw.payload.selector,
                    }
                });
            }
        };

        socket.onclose = () => {
            console.log("Disconnected from WebSocket");
        };

        return () => {
            socket.close();

            // Clear all pending message timeouts & Cancel their delivery attempts
            pendingRef.current.forEach((entry) => clearTimeout(entry.timeout));
            pendingRef.current.clear();
        };
    }, [roomId, userId]);

    // Send a message to the WebSocket server with retry logic
    const send = (event: AppEvent) => {
        const socket = wsRef.current;

        // Don't send messages if the socket is not open
        if (!socket || (socket.readyState !== WebSocket.OPEN)) {
            return;
        }

        socket.send(JSON.stringify(event));

        // Attempt to deliver the message to the server
        const attemptDelivery = (attempt = 1) => {
            const entry = pendingRef.current.get(event.id);

            // Don't attempt to deliver the message if it's already been cancelled
            if (!entry || entry.cancelled) {
                return;
            }

            // Cancel message delivery if it hasn't been delivered after a few attempts
            if (attempt > 3) {
                console.error(`Message delivery failed permanently: ${event.type}`);
                pendingRef.current.delete(event.id);
                return;
            }

            // Attempt to deliver the message again if the socket is still open
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(event));
                entry.timeout = setTimeout(() => attemptDelivery(attempt + 1), 1000);
            }
        };

        // Set up a timeout to attempt to deliver the message again if it hasn't been acknowledged
        const timeout = setTimeout(() => attemptDelivery(2), 1000);

        // Add the pending message to the store for delivery confirmation
        pendingRef.current.set(event.id, {
            id: event.id,
            event,
            timeout,
            cancelled: false,
        });
    };

    return { state, send };
}
