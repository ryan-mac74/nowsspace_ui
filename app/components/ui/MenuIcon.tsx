import { cn } from "../../lib/tailwind";

type MenuIconProps = {
    Icon: React.ElementType;
    className?: string;
};

export default function MenuIcon({ Icon, className }: MenuIconProps) {
    return (
        <Icon
            className={cn(
                "w-4 sm:w-6 h-4 sm:h-6 text-neutral-700 dark:text-neutral-300",
                className
            )}
        />
    );
}
