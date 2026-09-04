"use client";

import { useState, useEffect } from "react";
import type { UserPublic } from "../types/users";
import type { Room } from "../types/rooms";
import { authFetch } from "../utils/auth";
import SessionRoom from "./SessionRoom";
import PopupMenu from "./containers/PopupMenu";
import LaunchButton from "./ui/LaunchButton";

type Props = {
    SDK_URL: string;
    WS_URL: string;
    user: UserPublic | null;
};

export default function AppOverlay({ SDK_URL, WS_URL, user }: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeRoom, setActiveRoom] = useState<Room | null>(null);
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
    const [isLoadingRooms, setIsLoadingRooms] = useState(false);

    // Guest User for unauthenticated users
    const [guestUser] = useState<UserPublic>(() => {
        const guestUserId = Math.floor(Math.random() * 1000000);

        return {
            id: -guestUserId,
            email: "",
            username: `guest.${guestUserId}`,
            name: `Guest ${guestUserId}`,
            is_active: true,
            is_verified: false,
            is_superuser: false,
        };
    });

    useEffect(() => {
        if (isMenuOpen) {
            // Fetch rooms when the menu is opened
            const fetchRooms = async () => {
                setIsLoadingRooms(true);

                try {
                    const response = await authFetch(`${SDK_URL}/rooms`);
                    if (response.ok) {
                        const data = await response.json();
                        setAvailableRooms(data.rooms || []);
                    }
                } catch (error) {
                    console.error("❌ Failed to fetch rooms:", error);
                } finally {
                    setIsLoadingRooms(false);
                }
            };

            fetchRooms();
        }
    }, [isMenuOpen, SDK_URL]);

    // Create a new room
    const handleCreateRoom = async () => {
        const currentUserId = user?.id || guestUser.id;
        const roomName = "Room";

        try {
            const response = await authFetch(`${SDK_URL}/rooms`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: roomName,
                    owner_id: String(currentUserId),
                })
            });

            if (response.ok) {
                const newRoom: Room = await response.json();

                setActiveRoom(newRoom);
                setIsMenuOpen(false);
            }
        } catch (error) {
            console.error("❌ Failed to create room:", error);
        }
    };

    // Join an existing room
    const handleJoinRoom = (roomId: string) => {
        const targetRoom = availableRooms.find(r => r.id === roomId);

        if (targetRoom) {
            setActiveRoom(targetRoom);
        } else {
            // Fallback if room metadata isn't cached yet
            setActiveRoom({
                id: roomId,
                name: `Room ${roomId}`,
                owner_id: "",
                created_at: new Date().toISOString(),
            });
        }

        setIsMenuOpen(false);
    };

    // Delete an existing room
    const handleDeleteRoom = async (roomId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // prevent the click from triggering the join button

        if (!window.confirm("Are you sure you want to permanently delete this room?")) {
            return;
        }

        try {
            const response = await authFetch(`${SDK_URL}/rooms/${roomId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Remove the room from the local state list immediately
                setAvailableRooms((prev) => prev.filter(r => r.id !== roomId));

                // If the deleted room is currently active, close it
                if (activeRoom?.id === roomId) {
                    setActiveRoom(null);
                }
            } else {
                console.error("❌ Failed to delete room:", await response.text());
            }
        } catch (error) {
            console.error("❌ Error connecting to server to delete room:", error);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 pointer-events-none">
                {/* Session Room */}
                {activeRoom && (
                    <SessionRoom
                        WS_URL={WS_URL}
                        roomId={activeRoom.id}
                        roomOwnerId={activeRoom.owner_id}
                        user={user || guestUser}
                        onLeave={() => setActiveRoom(null)}
                    />
                )}
            </div>

            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
                {/* Popup Menu */}
                {isMenuOpen && (
                    <PopupMenu
                        availableRooms={availableRooms}
                        isLoadingRooms={isLoadingRooms}
                        handleCreateRoom={handleCreateRoom}
                        handleJoinRoom={handleJoinRoom}
                        handleDeleteRoom={handleDeleteRoom}
                    />
                )}

                {/* Floating Launch Button */}
                <LaunchButton
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                />
            </div>
        </>
    );
}
