"use client";

import Logo from "./Logo";

type Props = {
    isMenuOpen: boolean;
    setIsMenuOpen: (open: boolean) => void;
};

export default function LaunchButton({ isMenuOpen, setIsMenuOpen }: Props) {
    return (
        <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-95 flex items-center justify-center hover:shadow-xl"
        >
            {isMenuOpen ? (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ) : (
                <Logo />
            )}
        </button>
    );
}
