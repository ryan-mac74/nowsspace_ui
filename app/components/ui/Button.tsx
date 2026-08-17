"use client";

import { forwardRef } from "react";
import { cn } from "../../lib/tailwind";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, type = "button", disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                type={type}
                disabled={disabled}
                className={cn(
                    "inline-flex items-center justify-center font-medium text-sm rounded-xl transition-all cursor-pointer px-4 py-2",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
export default Button;
