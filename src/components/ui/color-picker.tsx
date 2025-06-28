'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Input } from './input';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localColor, setLocalColor] = useState(color);
  const popoverRef = useRef<HTMLDivElement>(null);

  const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#00ffff', '#ff00ff', '#c0c0c0', '#808080'
  ];

  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  const handleColorSelect = (newColor: string) => {
    setLocalColor(newColor);
    onChange(newColor);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setLocalColor(newColor);
    if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
      onChange(newColor);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
        >
          <div 
            className="w-5 h-5 rounded border"
            style={{ backgroundColor: color }}
          />
          <span>{color.toUpperCase()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" ref={popoverRef}>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {colors.map((c) => (
            <button
              key={c}
              className="w-8 h-8 rounded border cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-primary"
              style={{ backgroundColor: c }}
              onClick={() => handleColorSelect(c)}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded border"
            style={{ backgroundColor: localColor }}
          />
          <Input 
            type="text" 
            value={localColor} 
            onChange={handleInputChange}
            className="flex-1 uppercase"
            placeholder="#RRGGBB"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
