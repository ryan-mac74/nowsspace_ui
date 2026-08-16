"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "../../hooks/useChat";
import AppHeader from "../AppHeader";
import AIMessage from "../AIMessage";
import Logo from "../ui/Logo";

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
    }, [messages, isLoading]);

    // Handle form submission
    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();

        // Don't send empty messages OR while loading
        if (!input.trim() || isLoading) {
            return;
        }

        sendMessage(input);
        setInput("");
    };

    return (
        <div className="w-full max-w-4xl flex-1 flex flex-col bg-zinc-950 border border-zinc-800/80 rounded-3xl shadow-2xl overflow-hidden mt-4 mb-16 relative z-10">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
                <AppHeader />

                {messages.length === 0 ? (
                    <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-white space-y-3">
                        <p className="text-lg font-medium text-zinc-400">
                            Hello! What do you have in mind?
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-3.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {/* SVG Logo */}
                            {msg.role !== "user" && (
                                <Logo
                                    className="
                                        w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 
                                        flex items-center justify-center shrink-0 mt-1 shadow-sm
                                    "
                                />
                            )}

                            {/* Message Box */}
                            <div
                                className={`
                                    ${msg.role === "user"
                                        ? "max-w-[80%] bg-zinc-800 text-zinc-100 rounded-3xl rounded-br-md px-5 py-3 text-sm border border-zinc-700/60 shadow-sm"
                                        : "flex-1 max-w-[92%] bg-transparent text-zinc-100 py-1"
                                    }
                                `}
                            >
                                {msg.role === "user" ? (
                                    <p className="whitespace-pre-wrap">
                                        {msg.content}
                                    </p>
                                ) : (
                                    <AIMessage content={msg.content} />
                                )}
                            </div>
                        </div>
                    ))
                )}

                {/* Loading Gemini shimmer */}
                {isLoading && (
                    <div className="flex gap-3.5 items-start">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shrink-0 animate-pulse">
                            <Logo
                                className="
                                    w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 
                                    flex items-center justify-center shrink-0 mt-1 shadow-sm
                                "
                            />
                        </div>

                        <div className="flex items-center gap-1.5 py-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
                            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                            <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </div>
                )}

                {/* Scroll Anchor */}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Prompt */}
            <form onSubmit={handleSend} className="p-4 bg-zinc-950 border-t border-zinc-800">
                <div className="relative flex items-center max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        disabled={isLoading}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything..."
                        className="
                            w-full bg-zinc-900 border border-zinc-700/80 rounded-full pl-6 pr-14 py-3.5 text-zinc-100 placeholder-zinc-500 
                            focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 transition-all text-sm
                        "
                    />

                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="
                            absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white 
                            rounded-full transition-all flex items-center justify-center
                        "
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
}
