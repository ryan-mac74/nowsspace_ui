import { useState } from "react";

export type Message = {
    id: string;
    role: "user" | "ai";
    content: string;
};

export function useChat(sdkUrl: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async (text: string) => {
        // Don't send empty messages
        if (!text.trim()) {
            return;
        }

        // Add user message to UI immediately
        const userMsg: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
        };
        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const res = await fetch(`${sdkUrl}/ai/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: text,
                }),
            });

            if (res.ok) {
                const data = await res.json();

                // Add AI response to UI
                const aiMsg: Message = {
                    id: crypto.randomUUID(),
                    role: "ai",
                    content: data.response,
                };
                setMessages((prev) => [...prev, aiMsg]);
            } else {
                console.error("Failed to generate response");
            }
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return { messages, isLoading, sendMessage };
}
