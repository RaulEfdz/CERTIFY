import React from 'react';
import { RectangleHorizontal, Square } from 'lucide-react';
import type { TemplateConfig } from '../types';

// Utility functions
export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Constants
export const CERTIFICATE_DIMENSIONS = {
  square: { width: 800, height: 800, aspectRatio: '1/1' },
  landscape: { width: 1000, height: 707, aspectRatio: '16/9' },
} as const;

interface CertificateSizeOption {
  value: 'square' | 'landscape';
  label: string;
  icon: React.ReactNode;
}

export const CERTIFICATE_SIZES: readonly CertificateSizeOption[] = [
  {
    value: 'square',
    label: 'Cuadrado',
    icon: <Square size={16} />,
  },
  {
    value: 'landscape',
    label: 'Horizontal',
    icon: <RectangleHorizontal size={16} />,
  },
];

export const DEFAULT_TEMPLATE: TemplateConfig = {
  logoUrl: '',
  logoWidth: 200,
  logoHeight: 100,
  backgroundUrl: null,
  title: 'Certificado de Finalización',
  body1: 'Se otorga el presente certificado a',
  body2: 'por haber completado exitosamente el curso de',
  courseName: 'Nombre del Curso',
  studentName: '',
  signatures: [{ imageUrl: '', dataAiHint: 'firma' }],
  overlayColor: 'rgba(255, 255, 255, 0.9)',
  certificateSize: 'landscape',
  titleColor: '#000000',
  bodyColor: '#333333',
  customCss: '',
  customJs: '',
  orientation: 'landscape',
};
