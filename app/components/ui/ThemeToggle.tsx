"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import type { ThemePreference } from "../../context/theme";
import Button from "./Button";
import useLanguage from "../../hooks/useLanguage";
import type { TranslationKey } from "../../i18n/translations";

const OPTIONS: Record<ThemePreference, { Icon: typeof Sun; label: TranslationKey; next: TranslationKey }> = {
    system: { Icon: Monitor, label: "theme.system", next: "theme.name.light" },
    light: { Icon: Sun, label: "theme.light", next: "theme.name.dark" },
    dark: { Icon: Moon, label: "theme.dark", next: "theme.name.system" },
};

export default function ThemeToggle() {
    const { preference, toggleTheme } = useTheme();
    const { t } = useLanguage();

    const { Icon, label: labelKey, next: nextKey } = OPTIONS[preference];
    const label = t(labelKey);

    return (
        <Button
            onClick={toggleTheme}
            aria-label={t("theme.switchTo", { label, next: t(nextKey) })}
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
