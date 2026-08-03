"use client";

import { useState, useEffect } from "react";
import { UserPublic } from "../types/users";
import { Room } from "../types/rooms";
import SessionRoom from "./SessionRoom";
import PopupMenu from "./PopupMenu";
import LaunchButton from "./LaunchButton";

type Props = {
    SDK_URL: string;
    WS_URL: string;
    user: UserPublic | null;
};

export default function AppOverlay({ SDK_URL, WS_URL, user }: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
    const [isLoadingRooms, setIsLoadingRooms] = useState(false);

    // Guest User for unauthenticated users
    const [guestUser] = useState<UserPublic>(() => {
        const guestUserId = Math.floor(Math.random() * 10000);

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
                    const response = await fetch(`${SDK_URL}/rooms`);
                    if (response.ok) {
                        const data = await response.json();
                        setAvailableRooms(data.rooms || []);
                    }
                } catch (error) {
                    console.error("Failed to fetch rooms:", error);
                } finally {
                    setIsLoadingRooms(false);
                }
            };

            fetchRooms();
        }
    }, [isMenuOpen]);

    // Create a new room
    const handleCreateRoom = async () => {
        const currentUserId = user?.id || guestUser.id;

        try {
            const response = await fetch(`${SDK_URL}/rooms`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: `Room ${Math.floor(Math.random() * 1000)}`,
                    owner_id: String(currentUserId),
                })
            });

            if (response.ok) {
                const newRoom = await response.json();

                setActiveRoomId(newRoom.id);
                setIsMenuOpen(false);
            }
        } catch (error) {
            console.error("Failed to create room:", error);
        }
    };

    // Join an existing room
    const handleJoinRoom = (roomId: string) => {
        setActiveRoomId(roomId);
        setIsMenuOpen(false);
    };

    // Delete an existing room
    const handleDeleteRoom = async (roomId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // prevent the click from triggering the join button

        if (!window.confirm("Are you sure you want to permanently delete this room?")) {
            return;
        }

        try {
            const response = await fetch(`${SDK_URL}/rooms/${roomId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Remove the room from the local state list immediately
                setAvailableRooms((prev) => prev.filter(r => r.id !== roomId));

                // If the deleted room is currently active, close it
                if (activeRoomId === roomId) {
                    setActiveRoomId(null);
                }
            } else {
                console.error("Failed to delete room:", await response.text());
            }
        } catch (error) {
            console.error("Error connecting to server to delete room:", error);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 pointer-events-none">
                {/* Session Room */}
                {activeRoomId && (
                    <SessionRoom
                        WS_URL={WS_URL}
                        roomId={activeRoomId}
                        user={user || guestUser}
                        onLeave={() => setActiveRoomId(null)}
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
