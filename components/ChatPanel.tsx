"use client";

import { useState } from "react";
import { AppEvent, ChatMessage } from "@/lib/types";

type Props = {
    roomId: string;
    userId: string;
    messages: ChatMessage[];
    send: (event: AppEvent) => void;
};

export default function ChatPanel({ roomId, userId, messages, send }: Props) {
    const [text, setText] = useState("");

    function sendMessage() {
        if (!text.trim()) {
            return;
        }

        // Send message event to the server
        send({
            id: crypto.randomUUID(),
            type: "chat.message",
            room: roomId,
            payload: {
                id: crypto.randomUUID(),
                user_id: userId,
                message: text
            }
        });

        setText("");
    }

    return (
        <div className="fixed bottom-4 right-4 w-80 bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-2xl z-40 text-white">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 px-1">
                Room Chat
            </h3>

            {/* Messages Log Container */}
            <div className="h-64 overflow-y-auto flex flex-col gap-2 mb-3 pr-1 scrollbar-thin">
                {messages.map((m, index) => {
                    const isSelf = m.user_id === userId;
                    return (
                        <div
                            key={`${m.id || crypto.randomUUID()}-${index}`}
                            className={`p-2 rounded text-sm max-w-[85%] border 
                                ${isSelf
                                    ? "bg-blue-600/20 border-blue-500/30 self-end text-right"
                                    : "bg-zinc-800 border-zinc-700/50 self-start"
                                }`
                            }
                        >
                            <div className="text-[10px] text-zinc-400 font-mono mb-0.5">
                                @{m.user_id} {isSelf && "(You)"}
                            </div>
                            <div className="text-zinc-100 break-words text-left">
                                {m.message}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input Action Group */}
            <div className="flex gap-2">
                <input
                    className="
                        flex-1 bg-zinc-800 border border-zinc-700/80 px-3 py-2 rounded-lg text-sm text-white 
                        placeholder-zinc-500 outline-none focus:border-zinc-500 transition
                    "
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type message..."
                    onKeyDown={(e) => (e.key === "Enter") && sendMessage()}
                />

                <button
                    onClick={sendMessage}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-4 rounded-lg transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
