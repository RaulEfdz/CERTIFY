"use client";

import { Button } from "@/components/ui/button";
import { Search, Bell } from "lucide-react";
import { usePathname } from 'next/navigation';
import { Input } from "../ui/input";

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
  
  const getTitle = () => {
    if (pathname.startsWith('/templates/edit/')) {
        return "Editar Plantilla";
    }
    return pageTitles[pathname] || "Certify";
  }

  return (
    <header className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 shrink-0 bg-background border-b">
      <h1 className="text-2xl font-semibold font-headline">{getTitle()}</h1>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar..." className="pl-8 w-[200px] lg:w-[300px] rounded-md" />
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificaciones</span>
        </Button>
      </div>
    </header>
  );
}
