export interface SignatureData {
    imageUrl: string;
    dataAiHint?: string;
}

export type CertificateSize = 'square' | 'landscape';

export interface TemplateConfig {
    orientation: string;
    date?: string;
    dateLocale?: string;
    logoUrl: string;
    logoWidth: number;
    logoHeight: number;
    backgroundUrl: string | null;
    title: string;
    body1: string;
    body2: string;
    courseName: string;
    studentName: string;
    directorName?: string;
    signatures: SignatureData[];
    overlayColor: string;
    certificateSize: CertificateSize;
    titleColor: string;
    bodyColor: string;
    customCss: string;
    customJs: string;
}

export const CERTIFICATE_DIMENSIONS = {
    square: { width: 800, height: 800, aspectRatio: '1/1' },
    landscape: { width: 1000, height: 707, aspectRatio: '16/9' },
} as const;

export const DEFAULT_SIGNATURE: SignatureData = { 
    imageUrl: 'https://placehold.co/150x50.png', 
    dataAiHint: 'signature autograph' 
};

export const INITIAL_CONFIG: TemplateConfig = {
    logoUrl: 'https://placehold.co/80x80.png',
    logoWidth: 80,
    logoHeight: 80,
    backgroundUrl: null,
    title: 'Certificado de Finalización',
    body1: 'Este certificado se presenta con orgullo a',
    body2: 'por haber completado exitosamente el curso',
    courseName: 'Desarrollo Web Avanzado',
    studentName: 'Nombre del Estudiante',
    directorName: 'Firma del Director',
    signatures: [DEFAULT_SIGNATURE, DEFAULT_SIGNATURE],
    overlayColor: 'transparent',
    certificateSize: 'landscape' as CertificateSize,
    titleColor: '#111827',
    bodyColor: '#374151',
    customCss: '',
    customJs: '',
    orientation: 'landscape',
};