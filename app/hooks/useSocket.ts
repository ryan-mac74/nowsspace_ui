"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { AppState, AppEvent, PendingMessage, UserPresence } from "../types/action";
import { store } from "../lib/store";

export function useSocket(WS_URL: string, roomId: string, userId: string) {
    const [state, setState] = useState<AppState>(store.getState());
    const wsRef = useRef<WebSocket | null>(null);
    const pendingRef = useRef<Map<string, PendingMessage>>(new Map());
    const messageQueueRef = useRef<AppEvent[]>([]);
    const lastSeqRef = useRef<number>(-1);

    // Send a message with retry and pending queue management
    const send = useCallback((event: AppEvent) => {
        const socket = wsRef.current;

        // If socket is not ready yet, queue the event instead of dropping it
        if (!socket || (socket.readyState !== WebSocket.OPEN)) {
            messageQueueRef.current.push(event);
            return;
        }

        socket.send(JSON.stringify(event));

        // Handle message delivery
        const attemptDelivery = (attempt = 1) => {
            const entry = pendingRef.current.get(event.id);
            if (!entry || entry.cancelled) {
                return; // ignore cancelled messages
            }

            if (attempt > 3) {
                console.error(`❌ Message delivery failed permanently: ${event.type}`);
                pendingRef.current.delete(event.id);

                return; // ignore failed messages
            }

            // Retry sending the message if the socket is still open
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(event));

                entry.timeout = setTimeout(() => {
                    attemptDelivery(attempt + 1);
                }, 1000);
            }
        };

        // Attempt to deliver the message to the server
        const timeout = setTimeout(() => {
            attemptDelivery(2);
        }, 1000);

        // Add the message to the pending queue
        pendingRef.current.set(event.id, {
            id: event.id,
            event,
            timeout,
            cancelled: false,
        });
    }, []);

    // Subscribe to room state updates
    useEffect(() => {
        const unsubscribe = store.subscribe((newState) => {
            setState(newState);
        });

        return () => unsubscribe();
    }, []);

    // Connect to WebSocket server & Handle lifecycle
    useEffect(() => {
        const socket = new WebSocket(`${WS_URL}/${roomId}?user_id=${userId}`);
        wsRef.current = socket;

        socket.onopen = () => {
            console.log("Connected to WebSocket");

            // Flush any messages queued before the socket was fully open
            while (messageQueueRef.current.length > 0) {
                const queuedEvent = messageQueueRef.current.shift();
                if (queuedEvent) {
                    send(queuedEvent);
                }
            }
        };

        socket.onmessage = (e) => {
            const raw = JSON.parse(e.data);

            // Check for ACK messages to confirm delivery of sent events
            if (raw.type === "ack") {
                const id = raw.eventId;
                const entry = pendingRef.current.get(id);

                // If event is not in the pending queue, ignore it
                if (entry) {
                    entry.cancelled = true;
                    clearTimeout(entry.timeout);
                    pendingRef.current.delete(id);
                }

                return;
            }

            // Handle state snapshots
            if ((raw.type === "state.snapshot") && raw.payload) {
                Object.entries(raw.payload).forEach(([key, value]) => {
                    // Normalize user data to have consistent structure
                    if ((key === "users") && (typeof value === "object") && (value !== null)) {
                        const normalizedUsers: Record<string, UserPresence> = {};

                        Object.entries(value as Record<string, UserPresence>).forEach(([uid, uData]) => {
                            normalizedUsers[uid] = {
                                id: uData?.id || uid,
                                name: uData?.name || `Guest ${uid}`,
                                username: uData?.username || `guest.${uid}`,
                                color: uData?.color || "#3B82F6",
                                page: uData?.page || "/",
                            };
                        });

                        // Update state with normalized users
                        store.applyPatch({
                            type: "state.patch",
                            op: "set",
                            path: "users",
                            value: normalizedUsers,
                        });

                        return;
                    }

                    // Update state with raw data
                    store.applyPatch({
                        type: "state.patch",
                        op: "set",
                        path: key,
                        value,
                    });
                });

                return;
            }

            // Handle state patches
            if (raw.type === "state.patch") {
                if ((raw.seq !== undefined) && (raw.seq < lastSeqRef.current)) {
                    return; // ignore old patches
                }

                // Update last sequence if it's newer
                if (raw.seq !== undefined) {
                    lastSeqRef.current = raw.seq;
                }

                // Normalize user data to have consistent structure
                if (raw.path && raw.path.startsWith("users.") && (raw.op === "set") && raw.value) {
                    const uid = raw.path.replace("users.", "");
                    const uData = raw.value;

                    // Update state with normalized user
                    store.applyPatch({
                        type: "state.patch",
                        op: "set",
                        path: `users.${uid}`,
                        value: {
                            id: uData.id || uid,
                            name: uData.name || `Guest ${uid}`,
                            username: uData.username || `guest.${uid}`,
                            color: uData.color || "#3B82F6",
                            page: uData.page || "/",
                        }
                    });

                    return;
                }

                // Update state with raw patch
                store.applyPatch(raw);
            }
        };

        socket.onclose = () => {
            console.log("Disconnected from WebSocket");
        };

        return () => {
            socket.close();
            store.resetState();

            // Cancel any pending events
            pendingRef.current.forEach((entry) => {
                clearTimeout(entry.timeout);
            });
            pendingRef.current.clear();

            // Clear any queued messages
            messageQueueRef.current = [];
        };
    }, [roomId, userId, WS_URL, send]);

    return { state, send };
}
