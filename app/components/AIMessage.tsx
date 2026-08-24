"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
    content: string;
};

export default function AIMessage({ content }: Props) {
    return (
        <div className="text-zinc-100 text-sm leading-7 space-y-4 font-normal tracking-wide">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    /* Styled Headings */
                    h1: ({ children }) => (
                        <h1 className="text-2xl font-semibold text-zinc-50 mt-6 mb-3 border-b border-zinc-800 pb-1">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-xl font-semibold text-zinc-100 mt-5 mb-2">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-lg font-medium text-zinc-200 mt-4 mb-2">
                            {children}
                        </h3>
                    ),

                    /* Paragraphs */
                    p: ({ children }) => (
                        <p className="mb-3 leading-relaxed">
                            {children}
                        </p>
                    ),

                    /* Bold Text */
                    strong: ({ children }) => (
                        <strong className="font-semibold text-zinc-100">
                            {children}
                        </strong>
                    ),

                    /* Lists */
                    ul: ({ children }) => (
                        <ul className="list-disc list-outside pl-6 space-y-1.5 mb-3 text-zinc-200">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal list-outside pl-6 space-y-1.5 mb-3 text-zinc-200">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="pl-1">
                            {children}
                        </li>
                    ),

                    /* Links */
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors font-medium"
                        >
                            {children}
                        </a>
                    ),

                    /* Blockquotes */
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-blue-500/70 bg-zinc-800/40 pl-4 py-1.5 my-3 rounded-r-md text-zinc-300 italic">
                            {children}
                        </blockquote>
                    ),

                    /* Tables */
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-4 border border-zinc-800 rounded-xl">
                            <table className="min-w-full text-left text-sm divide-y divide-zinc-800">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="bg-zinc-800/60 font-semibold text-zinc-200">
                            {children}
                        </thead>
                    ),
                    th: ({ children }) => (
                        <th className="px-4 py-3 text-xs uppercase tracking-wider">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="px-4 py-3 border-t border-zinc-800/60">
                            {children}
                        </td>
                    ),

                    /* Code blocks & Inline Code */
                    code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !match && !String(children).includes("\n");

                        if (isInline) {
                            return (
                                <code
                                    className="bg-zinc-800 text-pink-300 px-1.5 py-0.5 rounded text-sm font-mono border border-zinc-700/40"
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }

                        return (
                            <CodeBlock language={match ? match[1] : ""}>
                                {String(children).replace(/\n$/, "")}
                            </CodeBlock>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

// Language extension map for file downloads
const EXTENSION_MAP: Record<string, string> = {
    javascript: "js",
    js: "js",
    typescript: "ts",
    ts: "ts",
    jsx: "jsx",
    tsx: "tsx",
    python: "py",
    py: "py",
    html: "html",
    css: "css",
    json: "json",
    php: "php",
    sql: "sql",
    bash: "sh",
    sh: "sh",
    c: "c",
    java: "java",
    swift: "swift",
};

// Handle code actions (copy + download)
function CodeBlock({
    language,
    children,
}: {
    language: string;
    children: string;
}) {
    const [copied, setCopied] = useState(false);

    // Copy code to clipboard
    const handleCopy = async () => {
        await navigator.clipboard.writeText(children);

        setCopied(true);
        setTimeout(() => {
            setCopied(false)
        }, 2000);
    };

    // Download code as file
    const handleDownload = () => {
        const ext = EXTENSION_MAP[language.toLowerCase()] || language || "txt";
        const blob = new Blob([children], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `snippet.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="relative my-4 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 text-zinc-200 font-mono text-sm shadow-md">
            {/* Header Bar */}
            <div className="relative flex items-center justify-between px-4 py-2 bg-zinc-900/90 border-b border-zinc-800/80 text-xs text-zinc-400">
                <span className="uppercase font-semibold tracking-wider text-zinc-400">
                    {language || "code"}
                </span>

                <div className="flex items-center gap-1">
                    {/* Toast Notification */}
                    {copied && (
                        <div
                            className="
                                absolute right-16 -top-2 translate-y-[-100%] flex items-center gap-1 bg-zinc-800 text-emerald-400 border border-emerald-500/30 text-xs 
                                font-sans font-medium px-2 py-0.5 rounded shadow-lg transition-all duration-200
                            "
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            Copied to clipboard
                        </div>
                    )}

                    {/* Copy Button */}
                    <button
                        type="button"
                        onClick={handleCopy}
                        aria-label="Copy code"
                        className="p-1.5 rounded-md hover:bg-zinc-800 hover:text-zinc-100 text-zinc-400 transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-600"
                    >
                        {copied ? (
                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        )}
                    </button>

                    {/* Download Button */}
                    <button
                        type="button"
                        onClick={handleDownload}
                        aria-label="Download snippet"
                        className="p-1.5 rounded-md hover:bg-zinc-800 hover:text-zinc-100 text-zinc-400 transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-600"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Code Content */}
            <pre className="p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800">
                <code>
                    {children}
                </code>
            </pre>
        </div>
    );
}
