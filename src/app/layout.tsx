'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/layout/header';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { SessionProvider } from '@/components/auth/session-provider';
import { AuthCheck } from '@/components/auth/auth-check';
import { ToastProvider } from '@/components/providers/toast-provider';
import { DatabaseProvider } from '@/contexts/database-context';
import { DatabaseConnectionStatus } from '@/components/database/connection-status';

// Los metadatos deben estar en un archivo separado debido al uso de 'use client'
// Ver el archivo metadata.ts para los metadatos

// Componente para manejar la autenticación
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Determinar si la ruta actual es pública
  const pathname = usePathname();
  const isPublicRoute = ['/login', '/register', '/auth/callback'].includes(pathname);

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SessionProvider>
          <ToastProvider>
            <DatabaseProvider>
              {isPublicRoute ? (
                <main className="min-h-screen bg-background">
                  {children}
                </main>
              ) : (
                <SidebarProvider>
                  <Sidebar>
                    <MainSidebar />
                  </Sidebar>
                  <SidebarInset>
                    <Header />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-secondary">
                      <AuthCheck>
                        {children}
                      </AuthCheck>
                    </main>
                  </SidebarInset>
                </SidebarProvider>
              )}
              <Toaster />
              <DatabaseConnectionStatus />
            </DatabaseProvider>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
