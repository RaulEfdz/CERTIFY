import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { UserNav } from "@/components/layout/user-nav";
import { ThemeProvider } from "@/components/theme-provider";

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
          <header className="flex h-16 items-center gap-4 border-b border-white/10 bg-background/95 backdrop-blur-sm px-4 md:px-6">
            <div className="flex w-full items-center justify-between">
              <div className="md:hidden">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md p-2 text-white/70 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                >
                  <span className="sr-only">Abrir menú</span>
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="md:hidden">
                  <UserNav />
                </div>
              </div>
            </div>
          </header>
          
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
