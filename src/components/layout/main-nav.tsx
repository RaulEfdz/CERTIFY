"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { OrganizationSelector } from "@/components/organization/org-selector";
import { Icons } from "@/components/icons";

export function MainNav() {
  const pathname = usePathname();

  const items = [
    {
      href: "/dashboard",
      label: "Inicio",
      icon: <Icons.home className="h-4 w-4" />,
    },
    {
      href: "/dashboard/courses",
      label: "Cursos",
      icon: <Icons.bookOpen className="h-4 w-4" />,
    },
    {
      href: "/dashboard/certificates",
      label: "Certificados",
      icon: <Icons.certificate className="h-4 w-4" />,
    },
    {
      href: "/dashboard/analytics",
      label: "Análisis",
      icon: <Icons.barChart className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Icons.logo className="h-6 w-6" />
          <span className="font-bold">Certify</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-2">
        <div className="px-3 py-2">
          <OrganizationSelector />
        </div>
        
        <nav className="space-y-1 px-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
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
      </div>
    </div>
  );
}
