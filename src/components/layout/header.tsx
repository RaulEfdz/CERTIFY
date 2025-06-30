"use client";

import { Button } from "@/components/ui/button";
import { Search, Bell, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from 'next/navigation';
import { Input } from "../ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";

const pageTitles: { [key: string]: string } = {
  "/": "Panel",
  "/templates": "Plantillas",
  "/templates/new": "Crear Nueva Plantilla",
  "/keys": "Claves de API",
  "/audit-log": "Registro de Auditoría",
  "/settings": "Configuración",
};

export default function Header() {
  const pathname = usePathname();
  const [isDashboard, setIsDashboard] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setIsDashboard(pathname.startsWith('/dashboard'));
    
    // Load dashboard sidebar state if in dashboard
    if (pathname.startsWith('/dashboard')) {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        setIsCollapsed(JSON.parse(savedState));
      }
    }
  }, [pathname]);

  const toggleDashboardSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    
    // Dispatch custom event to notify MainNav
    window.dispatchEvent(new CustomEvent('dashboardSidebarToggle', { 
      detail: { collapsed: newState } 
    }));
  };
  
  const getTitle = () => {
    if (pathname.startsWith('/templates/edit/')) {
        return "Editar Plantilla";
    }
    if (pathname === '/dashboard') {
        return "Dashboard";
    }
    if (pathname === '/dashboard/certificates/editor') {
        return "Editor de Certificados";
    }
    if (pathname === '/dashboard/courses') {
        return "Cursos";
    }
    if (pathname === '/dashboard/analytics') {
        return "Análisis";
    }
    if (pathname.startsWith('/dashboard/organization')) {
        return "Organización";
    }
    return pageTitles[pathname] || "Certify";
  }

  return (
    <header className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 shrink-0 bg-background/95 backdrop-blur-sm border-b border-white/10 shadow-lg">
      <div className="flex items-center gap-3">
        {isDashboard ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDashboardSidebar}
            className="h-7 w-7 text-white hover:bg-white/10"
          >
            {isCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            <span className="sr-only">Toggle Dashboard Sidebar</span>
          </Button>
        ) : (
          <SidebarTrigger className="text-white hover:bg-white/10" />
        )}
        <h1 className="text-2xl font-semibold font-headline text-white">{getTitle()}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/70" />
          <Input 
            placeholder="Buscar..." 
            className="pl-8 w-[200px] lg:w-[300px] rounded-md bg-muted/30 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
          />
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-foreground hover:bg-muted/30 hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificaciones</span>
        </Button>
      </div>
    </header>
  );
}
