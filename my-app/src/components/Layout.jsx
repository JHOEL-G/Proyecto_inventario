import React, { useState } from "react";
import {
  LayoutDashboard,
  Car,
  Wrench,
  Users,
  FileText,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
} from "../components/ui/sidebar";

import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

// Páginas
import Dashboard from "../Pages/Dashboard";
import Vehicles from "../Pages/Vehicles";
import Maintenance from "../Pages/Maintenance";
import Clients from "../Pages/Clients";
import Reports from "../Pages/Reports";
import Reportes from "../Pages/Reportes";

export default function Layout({ keycloak }) {
  const [activePage, setActivePage] = useState("Dashboard");

  // ⬅ NUEVO: Control del sidebar en móvil
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { title: "Dashboard", icon: LayoutDashboard },
    { title: "Vehículos", icon: Car },
    { title: "Mantenimientos", icon: Wrench },
    { title: "Clientes", icon: Users },
    { title: "Reportes", icon: FileText },
    { title: "Reportes Mantenimientos", icon: FileText },
  ];

  const handleLogout = () => {
    keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  const renderContent = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;
      case "Vehículos":
        return <Vehicles />;
      case "Mantenimientos":
        return <Maintenance />;
      case "Clientes":
        return <Clients />;
      case "Reportes":
        return <Reports />;
      case "Reportes Mantenimientos":
        return <Reportes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      {/* ⬅ BOTÓN HAMBURGUESA MÓVIL */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white shadow-lg rounded-lg border border-slate-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-slate-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">

        {/* SIDEBAR RESPONSIVE */}
        <Sidebar
          className={`
            border-r border-slate-200 bg-white/80 backdrop-blur-xl
            fixed md:static z-40 h-full transition-transform duration-300
            ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <SidebarHeader className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <img
                  src="/logoFScar.png"
                  alt="Logo de Financialsoft"
                  className="w-full h-full"
                />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900">FINANCIALSOFT</h2>
                <p className="text-xs text-slate-500">Sistema de Gestión</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive = activePage === item.title;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`transition-all duration-200 rounded-xl mb-1 ${
                            isActive
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                              : "hover:bg-slate-100 text-slate-700"
                          }`}
                          onClick={() => {
                            setActivePage(item.title);
                            setIsOpen(false); // ⬅ Cierra menú en móvil
                          }}
                        >
                          <div className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                            <item.icon
                              className={`w-5 h-5 ${
                                isActive ? "text-white" : "text-slate-500"
                              }`}
                            />
                            <span className="font-medium">{item.title}</span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200 p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2">
                <Avatar className="w-10 h-10 border-2 border-blue-100">
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold">
                    U
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">
                    {keycloak.idTokenParsed.given_name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {keycloak.idTokenParsed.email}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* CONTENIDO */}
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>
    </SidebarProvider>
  );
}
