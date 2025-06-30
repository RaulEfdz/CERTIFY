import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const SegmentedControl = ({ options, value, onChange, className = '' }: { options: { value: string, label: string, icon: React.ReactNode }[], value: string, onChange: (value: string) => void, className?: string }) => (
    <div className={cn("flex items-center gap-2 p-1 rounded-lg bg-muted", className)}>
        {options.map(option => (
            <Button
                key={option.value}
                variant={value === option.value ? "default" : "ghost"}
                size="sm"
                onClick={() => onChange(option.value)}
                className="flex-1"
            >
                {option.icon}
                <span className="ml-2">{option.label}</span>
            </Button>
        ))}
    </div>
);