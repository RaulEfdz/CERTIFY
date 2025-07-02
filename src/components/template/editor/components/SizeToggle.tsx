import { cn } from "@/lib/utils";
import { RectangleHorizontal, Square } from "lucide-react";
import { CertificateSize, CERTIFICATE_DIMENSIONS } from "../types";

const CERTIFICATE_SIZES = [
    { 
        value: 'landscape', 
        label: 'Horizontal', 
        shortLabel: 'H',
        description: 'Formato apaisado',
        icon: RectangleHorizontal,
        dimensions: '16:9'
    },
    { 
        value: 'square', 
        label: 'Cuadrado', 
        shortLabel: 'C',
        description: 'Formato cuadrado',
        icon: Square,
        dimensions: '1:1'
    },
];

export const SizeToggle = ({ 
  value, 
  onChange,
  className = ''
}: { 
  value: CertificateSize;
  onChange: (value: CertificateSize) => void;
  className?: string;
}) => (
  <div className={cn("space-y-3", className)}>
    {/* Toggle Buttons */}
    <div className="grid grid-cols-2 gap-3">
      {CERTIFICATE_SIZES.map((size) => {
        const IconComponent = size.icon;
        const isSelected = value === size.value;
        
        return (
          <button
            key={size.value}
            type="button"
            onClick={() => onChange(size.value as CertificateSize)}
            className={cn(
              "relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all hover:scale-[1.02] group",
              isSelected
                ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20"
                : "border-border/40 hover:border-border/80 hover:bg-accent/30"
            )}
          >
            {/* Icon with background */}
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
              isSelected 
                ? "bg-primary/15 text-primary" 
                : "bg-muted/60 text-muted-foreground group-hover:bg-muted"
            )}>
              <IconComponent className="h-5 w-5" />
            </div>
            
            {/* Label and description */}
            <div className="text-center">
              <div className={cn(
                "text-sm font-medium transition-colors",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {size.label}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {size.description}
              </div>
              <div className={cn(
                "text-xs font-mono mt-1 px-2 py-0.5 rounded",
                isSelected 
                  ? "bg-primary/10 text-primary" 
                  : "bg-muted/60 text-muted-foreground"
              )}>
                {size.dimensions}
              </div>
            </div>
            
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full border-2 border-background" />
            )}
          </button>
        );
      })}
    </div>
    
    {/* Current selection info */}
    <div className="bg-muted/30 rounded-md p-3 border border-border/40">
      <div className="text-xs text-muted-foreground mb-1">Formato seleccionado</div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          {CERTIFICATE_SIZES.find(s => s.value === value)?.label}
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          {CERTIFICATE_SIZES.find(s => s.value === value)?.dimensions}
        </div>
      </div>
    </div>
  </div>
);