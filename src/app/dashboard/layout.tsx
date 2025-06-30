import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { UserNav } from "@/components/layout/user-nav";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 relative">
        {/* Mobile overlay */}
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" />
        
        {/* Sidebar - now handled by MainNav with its own responsive behavior */}
        <MainNav />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
          <Header />
          
          <main className="flex-1 overflow-y-auto bg-muted/40 p-4 md:p-6">
            <div className="mx-auto max-w-7xl">
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                {children}
              </ThemeProvider>
            </div>
          </main>
          
          <SiteFooter className="border-t" />
        </div>
      </div>
    </div>
  );
}
