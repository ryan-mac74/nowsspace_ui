"use client";

import type { Room } from "../../types/rooms";
import Button from "../ui/Button";

type Props = {
    availableRooms: Room[];
    isLoadingRooms: boolean;
    handleCreateRoom: () => void;
    handleJoinRoom: (roomId: string) => void;
    handleDeleteRoom: (roomId: string, e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function PopupMenu({
    availableRooms, isLoadingRooms, handleCreateRoom, handleJoinRoom, handleDeleteRoom
}: Props) {
    return (
        <div className="mb-4 w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden transform transition-all">
            <div className="p-3">
                <Button
                    onClick={handleCreateRoom}
                    className="
                        w-full text-left px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 
                        transition-colors mb-4 flex items-center
                    "
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Room
                </Button>

                <div className="px-2 pb-2 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                    Active Rooms
                </div>

                <ul className="space-y-1">
                    {isLoadingRooms ? (
                        <li className="px-2 py-2 text-sm text-gray-500 dark:text-zinc-400 italic">Loading rooms...</li>
                    ) : availableRooms.length === 0 ? (
                        <li className="px-2 py-2 text-sm text-gray-500 dark:text-zinc-400 italic">No rooms available</li>
                    ) : (
                        availableRooms.map(room => (
                            <li key={room.id} className="flex items-center gap-1">
                                {/* Join Button */}
                                <Button
                                    onClick={() => handleJoinRoom(room.id)}
                                    className="
                                        flex-1 flex justify-between items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 
                                        rounded-lg transition-colors text-sm text-gray-700 dark:text-zinc-200 font-medium
                                    "
                                >
                                    <span className="truncate">{room.name}</span>
                                    <span className="text-xs text-gray-400 dark:text-zinc-500 ml-2">#{room.id}</span>
                                </Button>

                                {/* Delete Button */}
                                <Button
                                    onClick={(e) => handleDeleteRoom(room.id, e)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-300 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                                    title="Delete Room"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </Button>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
