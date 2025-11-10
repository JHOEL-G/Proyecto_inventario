import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { AlertTriangle, Calendar } from "lucide-react";
import { format, isBefore, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

const PRIORITY_COLORS = {
  'baja': 'bg-blue-100 text-blue-800',
  'media': 'bg-yellow-100 text-yellow-800',
  'alta': 'bg-orange-100 text-orange-800',
  'urgente': 'bg-red-100 text-red-800'
};

export default function UpcomingMaintenance({ maintenances, vehicles, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle>Próximos Mantenimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const today = new Date();
  const nextWeek = addDays(today, 7);

  const upcomingMaintenances = maintenances
    .filter(m => {
      if (!m.next_service_date || m.status === 'completado') return false;
      const serviceDate = new Date(m.next_service_date);
      return isBefore(serviceDate, nextWeek);
    })
    .slice(0, 5);

  const getVehicleInfo = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brandName} ${vehicle.modelName}` : 'Vehículo desconocido';
  };

  return (
    <Card className="shadow-lg border-slate-200 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Próximos Mantenimientos
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {upcomingMaintenances.length > 0 ? (
          <div className="space-y-3">
            {upcomingMaintenances.map((maintenance) => (
              <div
                key={maintenance.id}
                className="p-4 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors bg-white"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-slate-900 text-sm">
                    {getVehicleInfo(maintenance.vehicle_id)}
                  </p>
                  <Badge className={PRIORITY_COLORS[maintenance.priority]}>
                    {maintenance.priority}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 mb-2">{maintenance.description}</p>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(maintenance.next_service_date), "d 'de' MMMM", { locale: es })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p>No hay mantenimientos próximos</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}