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
  SidebarTrigger
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Páginas
import Dashboard from "../Pages/Dashboard";
import Vehicles from "../Pages/Vehicles";
import Maintenance from "../Pages/Maintenance";
import Reports from "../Pages/Reports";
import Reportes from "../Pages/Reportes";
import Conductores from "../Pages/Conductores";

export default function Layout({ keycloak }) {
  const [activePage, setActivePage] = useState("Dashboard");


  const navigationItems = [
    { title: "Dashboard", icon: LayoutDashboard },
    { title: "Vehículos", icon: Car },
    { title: "Mantenimientos", icon: Wrench },
    { title: "Conductores", icon: Users },
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
      case "Conductores":
        return <Conductores />;
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        
        {/* Sidebar - SIN hidden md:flex para que funcione en móvil */}
        <Sidebar className="border-r border-slate-200 bg-white/80 backdrop-blur-xl">
          <SidebarHeader className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Car className="w-6 h-6 text-white" />
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
                          className={`transition-all duration-200 rounded-xl mb-1 ${
                            isActive
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                              : "hover:bg-slate-100 text-slate-700"
                          }`}
                          onClick={() => setActivePage(item.title)}
                        >
                          <item.icon
                            className={`w-5 h-5 ${
                              isActive ? "text-white" : "text-slate-500"
                            }`}
                          />
                          <span className="font-medium">{item.title}</span>
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
                    {keycloak.idTokenParsed.given_name.charAt(0)}
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

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {/* Header móvil con trigger */}
          <div className="md:hidden bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <SidebarTrigger />
              <h1 className="text-lg font-bold text-slate-900">FINANCIALSOFT</h1>
              <div className="w-10" />
            </div>
          </div>
          
          {/* Contenido de la página */}
          <div className="p-4 md:p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}