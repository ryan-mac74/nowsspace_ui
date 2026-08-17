"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { cn } from "../../lib/tailwind";
import { getInitials } from "../../utils/users";

type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
    name?: string;
    avatar?: string;
};

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
    ({ name = "", avatar = "", className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                {...props}
                className={cn(
                    "relative flex items-center justify-center font-bold rounded-full shrink-0 overflow-hidden",
                    "bg-zinc-800 text-zinc-100 border border-zinc-700",
                    "cursor-pointer transition hover:opacity-90",
                    "w-10 h-10 text-xs sm:text-sm select-none",
                    className
                )}
            >
                {avatar ? (
                    <Image
                        src={avatar}
                        alt={getInitials(name)}
                        unoptimized
                        fill
                        sizes="64px"
                        className="object-cover rounded-full"
                    />
                ) : (
                    <span>
                        {getInitials(name)}
                    </span>
                )}
            </div>
        );
    }
);

Avatar.displayName = "Avatar";
export default Avatar;
