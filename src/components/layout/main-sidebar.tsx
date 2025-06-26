'use client'

import { AppLogo } from "@/components/logo";
import { SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Home, FileText, KeyRound, History, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button";

export function MainSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { href: "/", label: "Panel", icon: Home },
        { href: "/templates", label: "Plantillas", icon: FileText },
        { href: "/keys", label: "Claves de API", icon: KeyRound },
        { href: "/audit-log", label: "Registro de Auditoría", icon: History },
    ];
    
    return (
        <div className="flex h-full flex-col">
            <div className="p-4 border-b border-sidebar-border">
                <Link href="/" className="flex items-center gap-3">
                    <AppLogo />
                    <span className="font-headline text-xl font-bold">Certify</span>
                </Link>
            </div>
            <SidebarContent>
                <SidebarMenu>
                    {menuItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild isActive={pathname.startsWith(item.href) && (item.href === '/' ? pathname === '/' : true)}>
                                <Link href={item.href}><item.icon />{item.label}</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <div className="mt-auto p-2 border-t border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                            <Link href="/settings"><Settings />Configuración</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start items-center gap-3 p-2 h-auto mt-2">
                             <Avatar className="h-9 w-9">
                                <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person avatar" />
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                                <p className="text-sm font-medium text-sidebar-foreground">Administrador</p>
                                <p className="text-xs text-muted-foreground">admin@example.com</p>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="right" sideOffset={8}>
                        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Perfil</DropdownMenuItem>
                        <DropdownMenuItem>Facturación</DropdownMenuItem>
                        <DropdownMenuItem>Configuración</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
