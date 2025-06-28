import { cn } from "@/lib/utils";
import { CertificateSize, CERTIFICATE_DIMENSIONS } from "../types";

const CERTIFICATE_SIZES = [
    { value: 'landscape', label: 'Landscape', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="18" height="12" x="3" y="6" rx="2"/></svg> },
    { value: 'square', label: 'Square', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="18" height="18" x="3" y="3" rx="2"/></svg> },
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
  <div className={cn("flex gap-2", className)}>
    {CERTIFICATE_SIZES.map((size) => (
      <button
        key={size.value}
        type="button"
        onClick={() => onChange(size.value as CertificateSize)}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 p-3 rounded-md border transition-colors",
          value === size.value
            ? "bg-primary/10 border-primary text-primary"
            : "border-input hover:bg-accent/50"
        )}
      >
        {size.icon}
        <span>{size.label}</span>
      </button>
    ))}
  </div>
);