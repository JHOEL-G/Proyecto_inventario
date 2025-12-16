import React, { useMemo } from "react";
import { base44 } from "../api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Car, Wrench, Users, DollarSign } from "lucide-react";
import StatsCard from "../components/dashboard/StatsCard";
import RecentMaintenanceList from "../components/dashboard/RecentMaintenanceList";
import VehicleStatusChart from "../components/dashboard/VehicleStatusChart";
import UpcomingMaintenance from "../components/dashboard/UpcomingMaintenance";

// Configuración optimizada de queries
const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutos - los datos se consideran frescos
  gcTime: 10 * 60 * 1000, // 10 minutos - mantener en caché
  refetchOnWindowFocus: false, // No recargar al volver a la ventana
  refetchOnMount: false, // No recargar al montar si hay datos en caché
};

export default function Dashboard() {
  const queryClient = useQueryClient();

  // Queries optimizadas con configuración de caché
  const { data: vehicles = [], isLoading: loadingVehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => base44.entities.Vehicle.list(),
    ...QUERY_CONFIG,
  });

  const { data: maintenances = [], isLoading: loadingMaintenance } = useQuery({
    queryKey: ['maintenances'],
    queryFn: () => base44.entities.Maintenance.list('-service_date'),
    ...QUERY_CONFIG,
  });

  const { data: conductores = [], isLoading: loadingConductores } = useQuery({
    queryKey: ['conductores'],
    queryFn: () => base44.entities.Conductores.list(), // CAMBIAR A PLURAL
    ...QUERY_CONFIG,
  });

  // Memoizar cálculos pesados para evitar recalcular en cada render
  const stats = useMemo(() => {
    const availableVehicles = vehicles.filter(v => v.status === 'disponible').length;
    const inMaintenanceCount = vehicles.filter(v => v.status === 'en_mantenimiento').length;
    const totalRevenue = vehicles.reduce((sum, v) => sum + (v.sale_price || 0), 0);
    const urgentMaintenance = maintenances.filter(
      m => m.priority === 'urgente' && m.status !== 'completado'
    ).length;

    return {
      availableVehicles,
      inMaintenanceCount,
      totalRevenue,
      urgentMaintenance,
    };
  }, [vehicles, maintenances]);

  const isLoading = loadingVehicles || loadingMaintenance || loadingConductores;

  // Función para refrescar todos los datos
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    queryClient.invalidateQueries({ queryKey: ['maintenances'] });
    queryClient.invalidateQueries({ queryKey: ['conductores'] });
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-600 mt-1">Resumen general del sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Vehículos"
          value={vehicles.length}
          icon={Car}
          gradient="from-blue-500 to-blue-600"
          trend={`${stats.availableVehicles} disponibles`}
          isLoading={isLoading}
        />
        <StatsCard
          title="Conductores"
          value={conductores.length}
          icon={Users}
          gradient="from-purple-500 to-purple-600"
          trend="Registrados"
          isLoading={isLoading}
        />
        <StatsCard
          title="En Mantenimiento"
          value={stats.inMaintenanceCount}
          icon={Wrench}
          gradient="from-orange-500 to-orange-600"
          trend={`${stats.urgentMaintenance} urgentes`}
          isLoading={isLoading}
        />
        <StatsCard
          title="Valor Inventario"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          gradient="from-green-500 to-green-600"
          trend="Total"
          isLoading={isLoading}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VehicleStatusChart vehicles={vehicles} isLoading={isLoading} />
        </div>
        <div>
          <UpcomingMaintenance
            maintenances={maintenances}
            vehicles={vehicles}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div>
        <RecentMaintenanceList
          maintenances={maintenances}
          vehicles={vehicles}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}