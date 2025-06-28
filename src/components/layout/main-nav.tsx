"use client";

import * as React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { OrganizationSelector } from "@/components/organization/org-selector";
import { Icons } from "@/components/icons";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function MainNav() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
    setIsMounted(true);
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
    }
  }, [isCollapsed, isMounted]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const items = [
    {
      href: "/dashboard",
      label: "Inicio",
      icon: <Icons.home className="h-5 w-5" />,
    },
    {
      href: "/dashboard/courses",
      label: "Cursos",
      icon: <Icons.bookOpen className="h-5 w-5" />,
    },
    {
      href: "/dashboard/certificates",
      label: "Certificados",
      icon: <Icons.home className="h-5 w-5" />, // Using home as fallback
    },
    {
      href: "/dashboard/analytics",
      label: "Análisis",
      icon: <Icons.home className="h-5 w-5" />, // Using home as fallback
    },
  ];

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';
  const logoSection = isCollapsed ? 'justify-center' : 'justify-between';

  return (
    <div className={`${sidebarWidth} flex flex-col h-full bg-background/95 backdrop-blur-sm border-r border-white/10 transition-all duration-300 ease-in-out`}>
      <div className={`flex h-16 items-center px-4 ${logoSection} border-b border-white/10`}>
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Certify Logo" className="h-8 w-8" />
            <span className="font-bold text-lg text-white">Certify</span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/dashboard" className="flex items-center justify-center w-full">
            <img src="/logo.png" alt="Certify Logo" className="h-8 w-8" />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 text-white/70 hover:bg-white/10 hover:text-white"
        >
          {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          <span className="sr-only">{isCollapsed ? 'Expandir menú' : 'Contraer menú'}</span>
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        {!isCollapsed && (
          <div className="px-3 py-2">
            <OrganizationSelector />
          </div>
        )}
        
        <nav className="space-y-1 px-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-3 text-sm font-medium rounded-lg mx-2 transition-colors duration-200",
                pathname === item.href
                  ? "bg-primary/20 text-white border-l-4 border-primary"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <div className="flex items-center">
                <span className={cn("transition-opacity duration-200", isCollapsed ? 'opacity-100' : 'opacity-100')}>
                  {React.cloneElement(item.icon, { className: 'h-5 w-5' })}
                </span>
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </div>
              {pathname === item.href && !isCollapsed && (
                <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
              )}
              {!isCollapsed && pathname !== item.href && (
                <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </Link>
          ))}
        </nav>
        
        <div className="px-3 py-2 mt-4 border-t">
          <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
            Configuración
          </h3>
          <nav className="space-y-1">
            <Link
              href="/dashboard/settings"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/dashboard/settings"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <Icons.settings className="mr-3 h-4 w-4" />
              Configuración
            </Link>
          </nav>
        </div>
        
        {/* Bottom spacer */}
        <div className="h-16"></div>
      </div>
      
      {/* Collapse button at bottom */}
      <div className="border-t border-white/10 p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="w-full justify-start text-white/70 hover:bg-white/10 hover:text-white"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <>
              <PanelLeftClose className="mr-2 h-5 w-5" />
              <span>Contraer menú</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
