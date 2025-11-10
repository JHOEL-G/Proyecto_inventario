import React, { useState } from "react";
import {
  LayoutDashboard,
  Car,
  Wrench,
  Users,
  FileText,
  LogOut,
  Image,
  ImageIcon,
  ImageDown,
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

// ✅ Importa tus páginas (componentes)
import Dashboard from "../Pages/Dashboard";
import Vehicles from "../Pages/Vehicles";
import Maintenance from "../Pages/Maintenance";
import Clients from "../Pages/Clients";
import Reports from "../Pages/Reports";
import Reportes from "../Pages/Reportes";

export default function Layout() {
  const [activePage, setActivePage] = useState("Dashboard");

  const navigationItems = [
    { title: "Dashboard", icon: LayoutDashboard },
    { title: "Vehículos", icon: Car },
    { title: "Mantenimientos", icon: Wrench },  // <- Consistente con case
    { title: "Clientes", icon: Users },
    { title: "Reportes", icon: FileText },
    { title: "Reportes Mantenimientos", icon: FileText },
  ];

  // ✅ Handler para logout (ajusta a tu auth: ej. router.navigate('/login'))
  const handleLogout = () => {
    // Ejemplo: Limpia token y redirige
    localStorage.removeItem('token');
    window.location.href = '/login';  // O usa useNavigate si tienes React Router
  };

  const renderContent = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;
      case "Vehículos":
        return <Vehicles />;
      case "Mantenimientos":  // <- Fix: Cambiado de "Maintenance" a "Mantenimientos"
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        {/* Sidebar */}
        <Sidebar className="border-r border-slate-200 bg-white/80 backdrop-blur-xl">
          <SidebarHeader className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br  rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <img 
                  src="/logoFScar.png" 
                  alt="Logo de Financialsoft" 
                  // CORRECCIÓN 1: Usamos object-contain para asegurar que el logo se vea completo
                  // CORRECCIÓN 2: Le damos un padding (p-1.5) para que no toque los bordes del recuadro azul
                  className="w-full h-full "
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
                          onClick={() => setActivePage(item.title)}
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
                    Usuario
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    usuario@email.com
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                onClick={handleLogout}  // <- Fix: Agregado el handler
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Contenido principal */}
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>
    </SidebarProvider>
  );
}