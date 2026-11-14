"use client";

import { Languages } from "lucide-react";
import useLanguage, { LANGUAGES } from "../../hooks/useLanguage";
import { LANGUAGE_NAMES } from "../../i18n/translations";
import Button from "./Button";

export default function LanguageToggle() {
    const { language, toggleLanguage, t } = useLanguage();
    const next = LANGUAGES[(LANGUAGES.indexOf(language) + 1) % LANGUAGES.length];

    return (
        <Button
            onClick={toggleLanguage}
            aria-label={t("language.switchTo", { name: LANGUAGE_NAMES[next] })}
            title={LANGUAGE_NAMES[language]}
            className="
                !p-2 gap-1 rounded-full text-zinc-500 hover:text-zinc-900
                dark:text-zinc-400 dark:hover:text-zinc-100
                hover:bg-zinc-100 dark:hover:bg-zinc-800/80
            "
        >
            <Languages className="size-5" />
            <span className="text-xs font-semibold">
                {language}
            </span>
        </Button>
    );
}
