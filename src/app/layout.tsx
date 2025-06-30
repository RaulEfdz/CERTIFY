import './globals.css';
import { Suspense } from 'react';
import ClientLayoutShell from '@/components/layout/ClientLayoutShell';

// Los metadatos deben estar en un archivo separado debido al uso de 'use client'
// Ver el archivo metadata.ts para los metadatos

// Componente para manejar la autenticación
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Suspense fallback={<div>Cargando...</div>}>
          <ClientLayoutShell>{children}</ClientLayoutShell>
        </Suspense>
      </body>
    </html>
  );
}

