"use client";

import { useState } from "react";
import type { AppEvent, UserPresence, ChatMessage } from "../../types/action";
import Button from "../ui/Button";
import useLanguage from "../../hooks/useLanguage";

type Props = {
    roomId: string;
    userId: string;
    users: Record<string, UserPresence>;
    messages: ChatMessage[];
    send: (event: AppEvent) => void;
};

export default function ChatPanel({
    roomId, userId, users, messages, send
}: Props) {
    const [text, setText] = useState("");
    const { t } = useLanguage();

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
        <div className="fixed bottom-24 right-4 w-80 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 shadow-2xl z-40 text-zinc-900 dark:text-white pointer-events-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 px-1">
                {t("roomChat.title")}
            </h3>

            {/* Messages Log Container */}
            <div className="h-40 overflow-y-auto flex flex-col gap-2 mb-2 pr-1 scrollbar-thin">
                {messages.map((m, index) => {
                    const user = users[m.user_id];

                    return (
                        <div
                            key={`${m.id || crypto.randomUUID()}-${index}`}
                            className={`p-2 rounded text-sm max-w-[85%] border 
                                ${m.user_id === userId
                                    ? "bg-blue-600/20 border-blue-500/30 self-end text-right"
                                    : "bg-zinc-100 dark:bg-zinc-800 border-zinc-300/50 dark:border-zinc-700/50 self-start"
                                }`
                            }
                        >
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mb-0.5">
                                @{user.username || `guest.${m.user_id}`} {m.user_id === userId && t("common.you")}
                            </div>
                            <div className="text-zinc-900 dark:text-zinc-100 break-words text-left">
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
                        flex-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700/80 px-3 py-2 rounded-lg text-sm text-zinc-900 dark:text-white 
                        placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition
                    "
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t("roomChat.placeholder")}
                    onKeyDown={(e) => (e.key === "Enter") && sendMessage()}
                />

                <Button
                    onClick={sendMessage}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-4 rounded-lg transition"
                >
                    {t("roomChat.send")}
                </Button>
            </div>
        </div>
    );
}
