import Image from "next/image";
import Link from "next/link";

const PROJECT_NAME =
    process.env.NEXT_PUBLIC_PROJECT_NAME ||
    "NowSSpace";

export default function Brand() {
    return (
        <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
        >
            <Image
                src="/logo.jpg"
                alt="NSS"
                width={1024}
                height={1024}
                unoptimized
                priority
                className="
                    w-6 sm:w-8 h-6 sm:h-8 invert dark:invert-0 object-contain 
                    group-hover:scale-105 transition-transform rounded-full
                "
            />

            <span
                className="
                    text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r 
                    from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent
                "
            >
                {PROJECT_NAME}
            </span>
        </Link>
    );
}
