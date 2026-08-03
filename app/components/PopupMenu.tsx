"use client";

import { Room } from "../types/rooms";

type Props = {
    availableRooms: Room[];
    isLoadingRooms: boolean;
    handleCreateRoom: () => void;
    handleJoinRoom: (roomId: string) => void;
    handleDeleteRoom: (roomId: string, e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function PopupMenu({ availableRooms, isLoadingRooms, handleCreateRoom, handleJoinRoom, handleDeleteRoom }: Props) {
    return (
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
                            <li key={room.id} className="flex items-center gap-1">
                                {/* Join Button */}
                                <button
                                    onClick={() => handleJoinRoom(room.id)}
                                    className="flex-1 flex justify-between items-center px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700 font-medium"
                                >
                                    <span className="truncate">{room.name}</span>
                                    <span className="text-xs text-gray-400 ml-2">#{room.id}</span>
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={(e) => handleDeleteRoom(room.id, e)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Room"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
