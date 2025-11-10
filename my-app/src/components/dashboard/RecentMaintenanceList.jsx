import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Wrench } from "lucide-react";

const STATUS_COLORS = {
  'pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'en_progreso': 'bg-blue-100 text-blue-800 border-blue-200',
  'completado': 'bg-green-100 text-green-800 border-green-200',
  'cancelado': 'bg-gray-100 text-gray-800 border-gray-200'
};

const TYPE_COLORS = {
  'preventivo': 'bg-blue-100 text-blue-800',
  'correctivo': 'bg-orange-100 text-orange-800',
  'revision': 'bg-purple-100 text-purple-800',
  'reparacion': 'bg-red-100 text-red-800'
};

export default function RecentMaintenanceList({ maintenances, vehicles, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle>Mantenimientos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const recentMaintenances = maintenances.slice(0, 8);

  const getVehicleInfo = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brandName} ${vehicle.modelName} - ${vehicle.license_plate || 'Sin placa'}` : 'Vehículo desconocido';
  };

  return (
    <Card className="shadow-lg border-slate-200 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-blue-600" />
          Mantenimientos Recientes
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {recentMaintenances.length > 0 ? (
          <div className="space-y-3">
            {recentMaintenances.map((maintenance) => (
              <div
                key={maintenance.id}
                className="p-4 rounded-lg border border-slate-200 hover:border-blue-300 transition-all bg-white hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {getVehicleInfo(maintenance.vehicle_id)}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">{maintenance.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={TYPE_COLORS[maintenance.maintenance_type]}>
                      {maintenance.maintenance_type}
                    </Badge>
                    <Badge variant="outline" className={STATUS_COLORS[maintenance.status]}>
                      {maintenance.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between items-center text-xs text-slate-500 mt-2 gap-2">
                  <span>{format(new Date(maintenance.service_date), "d 'de' MMMM, yyyy", { locale: es })}</span>
                  {maintenance.cost && (
                    <span className="font-semibold text-green-600">${maintenance.cost.toLocaleString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Wrench className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p>No hay mantenimientos registrados</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}