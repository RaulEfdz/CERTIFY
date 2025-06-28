import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Certify',
  description: 'Gestiona y genera certificados con facilidad.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Certify',
    description: 'Gestiona y genera certificados con facilidad.',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Certify Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Certify',
    description: 'Gestiona y genera certificados con facilidad.',
    images: ['/logo.png'],
  },
};

export default metadata;
