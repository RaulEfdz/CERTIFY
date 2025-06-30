import { useState } from "react";
import { FormField } from "./FormField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

interface LogoSectionProps {
  logoUrl: string;
  onLogoChange: (url: string) => void;
  logoWidth: number;
  onWidthChange: (width: number) => void;
  logoHeight: number;
  onHeightChange: (height: number) => void;
}

export const LogoSection = ({
  logoUrl,
  onLogoChange,
  logoWidth,
  onWidthChange,
  logoHeight,
  onHeightChange,
}: LogoSectionProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onLogoChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <FormField label="Logo del Certificado">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
            <Label
              htmlFor="logo-upload"
              className="cursor-pointer flex items-center justify-center p-2 rounded-md border border-dashed hover:bg-accent/50 transition-colors"
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              Subir logo
            </Label>
          </div>
          {(preview || logoUrl) && (
            <div className="relative">
              <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                <Image
                  src={preview || logoUrl}
                  alt="Logo preview"
                  fill
                  className="object-contain"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-muted text-foreground"
                onClick={() => {
                  setPreview(null);
                  onLogoChange('');
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Ancho (px)">
          <Input
            type="number"
            min={50}
            max={500}
            value={logoWidth}
            onChange={(e) => onWidthChange(Number(e.target.value))}
          />
        </FormField>
        <FormField label="Alto (px)">
          <Input
            type="number"
            min={20}
            max={300}
            value={logoHeight}
            onChange={(e) => onHeightChange(Number(e.target.value))}
          />
        </FormField>
      </div>
    </div>
  );
};
