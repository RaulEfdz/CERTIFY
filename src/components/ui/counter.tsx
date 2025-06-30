import { cn } from "@/lib/utils";

export const Counter = ({ value, max, className = '' }: { value: number, max: number, className?: string }) => (
    <div className={cn("text-xs text-muted-foreground", className)}>
        <span>{value}</span>
        <span className="mx-1">/</span>
        <span>{max}</span>
    </div>
);