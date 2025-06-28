import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export const FormField = ({ 
  label, 
  children, 
  error,
  className = ''
}: { 
  label: string; 
  children: React.ReactNode;
  error?: string;
  className?: string;
}) => (
  <div className={cn("space-y-2", className)}>
    <Label className="text-sm font-medium text-foreground/90">{label}</Label>
    {children}
    {error && (
      <div className="flex items-center text-sm text-destructive">
        <AlertCircle className="h-4 w-4 mr-1" />
        <span>{error}</span>
      </div>
    )}
  </div>
);