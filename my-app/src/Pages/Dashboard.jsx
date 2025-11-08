import React from "react";
import { base44 } from "../api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Car, Wrench, Users, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import StatsCard from "../components/dashboard/StatsCard";
import RecentMaintenanceList from "../components/dashboard/RecentMaintenanceList";
import VehicleStatusChart from "../components/dashboard/VehicleStatusChart";
import UpcomingMaintenance from "../components/dashboard/UpcomingMaintenance";

export default function Dashboard() {
  const { data: vehicles = [], isLoading: loadingVehicles } = useQuery({
  queryKey: ['vehicles'],
  queryFn: () => base44.entities.Vehicle.list(),
});


  const { data: maintenances = [], isLoading: loadingMaintenance } = useQuery({
    queryKey: ['maintenances'],
    queryFn: () => base44.entities.Maintenance.list('-service_date'),
  });

  const { data: clients = [], isLoading: loadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
  });

  const availableVehicles = vehicles.filter(v => v.status === 'disponible').length;
  const inMaintenanceCount = vehicles.filter(v => v.status === 'en_mantenimiento').length;
  const totalRevenue = vehicles.reduce((sum, v) => sum + (v.sale_price || 0), 0);
  const urgentMaintenance = maintenances.filter(m => m.priority === 'urgente' && m.status !== 'completado').length;

  const isLoading = loadingVehicles || loadingMaintenance || loadingClients;

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
          trend={`${availableVehicles} disponibles`}
          isLoading={isLoading}
        />
        <StatsCard
          title="Clientes"
          value={clients.length}
          icon={Users}
          gradient="from-purple-500 to-purple-600"
          trend="Registrados"
          isLoading={isLoading}
        />
        <StatsCard
          title="En Mantenimiento"
          value={inMaintenanceCount}
          icon={Wrench}
          gradient="from-orange-500 to-orange-600"
          trend={`${urgentMaintenance} urgentes`}
          isLoading={isLoading}
        />
        <StatsCard
          title="Valor Inventario"
          value={`$${totalRevenue.toLocaleString()}`}
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
          <UpcomingMaintenance maintenances={maintenances} vehicles={vehicles} isLoading={isLoading} />
        </div>
      </div>

      <div>
        <RecentMaintenanceList maintenances={maintenances} vehicles={vehicles} isLoading={isLoading} />
      </div>
    </div>
  );
}