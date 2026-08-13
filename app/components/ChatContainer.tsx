"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "../hooks/useChat";

const PROJECT_NAME =
    process.env.NEXT_PUBLIC_PROJECT_NAME ||
    "NowSSpace";

type Props = {
    SDK_URL: string;
};

export default function ChatContainer({ SDK_URL }: Props) {
    const { messages, isLoading, sendMessage } = useChat(SDK_URL);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle form submission
    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();

        // Don't send empty messages
        if (!input.trim()) {
            return;
        }

        sendMessage(input);
        setInput("");
    };

    return (
        <div className="w-full max-w-4xl flex-1 flex flex-col bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden mt-6 mb-20 relative z-10">
            {/* Chat Header */}
            <div className="p-5 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                    {PROJECT_NAME}
                </h1>
            </div>

            {/* Message Log */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-700">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-lg space-y-2">
                        <svg className="w-12 h-12 opacity-50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                        </svg>
                        <p>How can I help you today?</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`
                                    max-w-[85%] rounded-3xl px-6 py-4 text-base leading-relaxed 
                                    ${msg.role === "user"
                                        ? "bg-blue-600 text-white rounded-br-sm"
                                        : "bg-zinc-800 text-zinc-100 rounded-bl-sm border border-zinc-700/50"
                                    }
                                `}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))
                )}

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-zinc-800 text-zinc-400 rounded-3xl rounded-bl-sm px-6 py-4 border border-zinc-700/50 flex space-x-2 items-center">
                            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                    </div>
                )}

                {/* Scroll Anchor */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-4 bg-zinc-900 border-t border-zinc-800">
                <div className="relative flex items-center max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything..."
                        className="
                            w-full bg-zinc-800 border border-zinc-700 rounded-full px-6 py-4 text-white placeholder-zinc-400 
                            focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all pr-14
                        "
                        disabled={isLoading}
                    />

                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="
                            absolute right-2 p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white 
                            rounded-full transition-colors flex items-center justify-center
                        "
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                </div>
            </form>
        </div>
    );
}
