"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/layout/header';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { SessionProvider } from '@/components/auth/session-provider';
import { AuthCheck } from '@/components/auth/auth-check';
import { ToastProvider } from '@/components/providers/toast-provider';
import { DatabaseProvider } from '@/contexts/database-context';
import { DatabaseConnectionStatus } from '@/components/database/connection-status';

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = ['/login', '/register', '/auth/callback'].includes(pathname);
  const isTemplateEditorRoute = pathname.startsWith('/templates/edit/') || pathname === '/templates/new';

  return (
    <SessionProvider>
      <ToastProvider>
        <DatabaseProvider>
          {isPublicRoute ? (
            <main className="min-h-screen bg-background">
              {children}
            </main>
          ) : isTemplateEditorRoute ? (
            // Template editor gets full screen without sidebar/header
            <main className="min-h-screen bg-background">
              <AuthCheck>
                {children}
              </AuthCheck>
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
  );
}
