import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export const FormField = ({ 
  label, 
  children, 
  error,
  description,
  className = ''
}: { 
  label: string; 
  children: React.ReactNode;
  error?: string;
  description?: string;
  className?: string;
}) => (
  <div className={cn("space-y-2", className)}>
    <div>
      <Label className="text-sm font-medium text-foreground/90">{label}</Label>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
    {children}
    {error && (
      <div className="flex items-center text-sm text-destructive">
        <AlertCircle className="h-4 w-4 mr-1" />
        <span>{error}</span>
      </div>
    )}
  </div>
);