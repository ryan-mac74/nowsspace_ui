"use client";

import { useState, useRef, useEffect } from "react";
import { ShieldCheck, Clock } from "lucide-react";
import useAuth from "../hooks/useAuth";
import Brand from "./ui/Brand";
import Avatar from "./ui/Avatar";
import Button from "./ui/Button";
import MenuIcon from "./ui/MenuIcon";
import LoginDialog from "./dialogs/LoginDialog";
import LogoutDialog from "./dialogs/LogoutDialog";
import ActivationDialog from "./dialogs/ActivationDialog";

export default function AppHeader() {
    const {
        user,
        isAuthenticated,
        isLoading,
        logout,
        activateAccount,
        deactivateAccount,
        deleteAccount,
        deleteAllAccounts,
    } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Handle menu visibility
    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        // Close menu on outside click
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }

        // Close menu on escape key
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        }

        // Add event listeners on mount
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            // Remove event listeners on unmount
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [menuOpen]);

    return (
        <header className="w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between">
            <Brand />

            <div className="flex items-center gap-2">
                {isLoading ? (
                    <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />
                ) : !isAuthenticated ? (
                    <LoginDialog className="!text-white bg-gray-800" />
                ) : (
                    // Attach ref here to detect clicks outside this container
                    <div ref={menuRef} className="relative">
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="
                                flex items-center focus:outline-none rounded-full 
                                ring-2 ring-transparent focus:ring-blue-500/50 
                                transition-all cursor-pointer
                            "
                        >
                            <Avatar
                                name={user?.name}
                                avatar={user?.avatar}
                            />
                        </button>

                        {menuOpen && (
                            <div
                                className="
                                    absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 
                                    text-zinc-200 text-sm flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-150
                                "
                            >
                                <div className="px-3 py-2 border-b border-zinc-800/80 text-sm">
                                    <p className="font-semibold text-white">
                                        {user?.name || `Guest ${user?.id}`}
                                        {user?.username && (
                                            <span className="ml-2 text-zinc-200">
                                                @{user.username || `guest.${user.id}`}
                                            </span>
                                        )}
                                    </p>

                                    {user?.email && (
                                        <p className="text-zinc-300 truncate">
                                            {user.email}
                                        </p>
                                    )}

                                    {user?.is_superuser && (
                                        <span className="mt-0.5 text-xs inline-flex items-centerfont-bold text-zinc-400">
                                            <ShieldCheck className="size-4" /> SuperUser
                                        </span>
                                    )}
                                </div>

                                <LoginDialog className="w-full !justify-start !bg-transparent hover:!bg-zinc-800 !text-blue-400 !px-3 !py-2" />
                                <LogoutDialog
                                    onLogout={logout}
                                    className="w-full !justify-start !bg-transparent hover:!bg-zinc-800 !text-purple-400 !px-3 !py-2"
                                />

                                <div className="border-t border-zinc-800/80 my-1" />

                                {user?.is_active ? (
                                    <ActivationDialog
                                        action="deactivate"
                                        onConfirm={deactivateAccount}
                                        className="w-full !justify-start !bg-transparent hover:!bg-zinc-800 !text-yellow-400 !px-3 !py-2"
                                    />
                                ) : (
                                    <ActivationDialog
                                        action="activate"
                                        deletedAt={user?.deletedAt}
                                        onConfirm={activateAccount}
                                        className="w-full !justify-start !bg-transparent hover:!bg-zinc-800 !text-green-400 !px-3 !py-2"
                                    />
                                )}

                                <ActivationDialog
                                    action="delete"
                                    onConfirm={deleteAccount}
                                    className="w-full !justify-start !bg-transparent hover:!bg-zinc-800 !text-rose-400 !px-3 !py-2"
                                />

                                {user?.is_superuser && (
                                    <>
                                        <div className="border-t border-zinc-800/80 my-1" />

                                        <Button
                                            onClick={async () => {
                                                await deleteAllAccounts();
                                            }}
                                            className="w-full !justify-start !bg-transparent hover:!bg-zinc-800 !text-rose-800 !px-3 !py-2"
                                        >
                                            <MenuIcon Icon={Clock} />
                                            Delete All Accounts
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
