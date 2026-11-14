"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import type { ThemePreference } from "../../context/theme";
import Button from "./Button";

const OPTIONS: Record<ThemePreference, { Icon: typeof Sun; label: string; next: string }> = {
    system: { Icon: Monitor, label: "System theme", next: "light" },
    light: { Icon: Sun, label: "Light theme", next: "dark" },
    dark: { Icon: Moon, label: "Dark theme", next: "system" },
};

export default function ThemeToggle() {
    const { preference, toggleTheme } = useTheme();
    const { Icon, label, next } = OPTIONS[preference];

    return (
        <Button
            onClick={toggleTheme}
            aria-label={`${label} (switch to ${next})`}
            title={label}
            className="
                !p-2 rounded-full text-zinc-500 hover:text-zinc-900
                dark:text-zinc-400 dark:hover:text-zinc-100
                hover:bg-zinc-100 dark:hover:bg-zinc-800/80
            "
        >
            <Icon className="size-5" />
        </Button>
    );
}
