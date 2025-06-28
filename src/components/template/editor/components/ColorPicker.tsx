import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";
import { ColorWheel } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
  className?: string;
}

export const ColorPicker = ({
  value,
  onChange,
  label,
  className = '',
}: ColorPickerProps) => (
  <div className={cn("space-y-2", className)}>
    <Label className="text-sm font-medium text-foreground/80">
      {label}
    </Label>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
        >
          <div 
            className="w-4 h-4 rounded-full border" 
            style={{ backgroundColor: value }}
          />
          <span>{value}</span>
          <ColorWheel className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <HexColorPicker color={value} onChange={onChange} />
      </PopoverContent>
    </Popover>
  </div>
);
