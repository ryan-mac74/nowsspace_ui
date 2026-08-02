"use client";

import { useState, useEffect } from "react";
import { UserPublic } from "../types/user";
import SessionRoom from "./SessionRoom";
import LaunchButton from "./LaunchButton";

interface Room {
    id: string;
    name: string;
    owner_id: string;
    created_at: string;
}

type Props = {
    SDK_URL?: string;
    user: UserPublic | null;
};

export default function AppOverlay({ SDK_URL, user }: Props) {
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
                    const response = await fetch(`${SDK_URL}/api/rooms`);
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
            const response = await fetch(`${SDK_URL}/api/rooms`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: `Room ${Math.floor(Math.random() * 1000)}`,
                    user_id: String(currentUserId),
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

    return (
        <>
            <div className="fixed inset-0 z-50 pointer-events-none">
                {/* Session Room */}
                {activeRoomId && (
                    <SessionRoom
                        roomId={activeRoomId}
                        user={user || guestUser}
                        onLeave={() => setActiveRoomId(null)}
                    />
                )}
            </div>

            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
                {/* Popup Menu */}
                {isMenuOpen && (
                    <div className="mb-4 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all">
                        <div className="p-3">
                            <button
                                onClick={handleCreateRoom}
                                className="w-full text-left px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mb-4 flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Create New Room
                            </button>

                            <div className="px-2 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Active Rooms
                            </div>

                            <ul className="space-y-1">
                                {isLoadingRooms ? (
                                    <li className="px-2 py-2 text-sm text-gray-500 italic">Loading rooms...</li>
                                ) : availableRooms.length === 0 ? (
                                    <li className="px-2 py-2 text-sm text-gray-500 italic">No rooms available</li>
                                ) : (
                                    availableRooms.map(room => (
                                        <li key={room.id}>
                                            <button
                                                onClick={() => handleJoinRoom(room.id)}
                                                className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700 font-medium"
                                            >
                                                <span className="truncate">{room.name}</span>
                                                <span className="text-xs text-gray-400 ml-2">#{room.id}</span>
                                            </button>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>
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
