"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { OrganizationProvider } from "@/contexts/organization-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children, ...props }: { children: React.ReactNode } & ThemeProviderProps) {
  const [queryClient] = React.useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider {...props}>
        <OrganizationProvider>
          <TooltipProvider>
            {children}
            <Toaster position="top-center" />
            <ReactQueryDevtools initialIsOpen={false} />
          </TooltipProvider>
        </OrganizationProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
