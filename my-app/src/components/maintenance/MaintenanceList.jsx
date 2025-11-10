import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, Calendar, DollarSign, Wrench } from "lucide-react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const STATUS_COLORS = {
  'pendiente': 'bg-yellow-100 text-yellow-800',
  'en_progreso': 'bg-blue-100 text-blue-800',
  'completado': 'bg-green-100 text-green-800',
  'cancelado': 'bg-gray-100 text-gray-800'
};

const PRIORITY_COLORS = {
  'baja': 'bg-blue-100 text-blue-800',
  'media': 'bg-yellow-100 text-yellow-800',
  'alta': 'bg-orange-100 text-orange-800',
  'urgente': 'bg-red-100 text-red-800'
};

export default function MaintenanceList({ maintenances, vehicles, isLoading, onEdit, onDelete }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (maintenances.length === 0) {
    return (
      <div className="text-center py-16">
        <Wrench className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <p className="text-slate-500 text-lg">No se encontraron mantenimientos</p>
      </div>
    );
  }

  // CÓDIGO CORREGIDO PARA MAYOR COMPATIBILIDAD
const getVehicleInfo = (vehicleId) => {
  const vehicle = vehicles.find(v => v.id === vehicleId);
  
  if (!vehicle) return 'Vehículo desconocido';

  // Usar brand, model, licensePlate/serialNumber (ajusta según tus datos)
  const brand = vehicle.brand || vehicle.brandName || 'Marca';
  const model = vehicle.model || vehicle.modelName || 'Modelo';
  const identifier = vehicle.license_plate || vehicle.licensePlate || vehicle.serial_number || 'S/N';

  return `${brand} ${model} (${identifier})`;
};

  return (
    <div className="space-y-4">
      {maintenances.map((maintenance) => (
        <Card key={maintenance.id} className="border-slate-200 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {getVehicleInfo(maintenance.vehicle_id)}
                  </h3>
                  <Badge className={STATUS_COLORS[maintenance.status]}>
                    {maintenance.status}
                  </Badge>
                  <Badge className={PRIORITY_COLORS[maintenance.priority]}>
                    {maintenance.priority}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {maintenance.maintenance_type}
                  </Badge>
                </div>

                <p className="text-slate-700">{maintenance.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(maintenance.service_date), "d 'de' MMMM, yyyy", { locale: es })}</span>
                  </div>
                  {maintenance.cost && (
                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>${maintenance.cost.toLocaleString()}</span>
                    </div>
                  )}
                  {maintenance.mechanic && (
                    <div>
                      <span className="font-medium">Mecánico:</span> {maintenance.mechanic}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(maintenance)}
                  className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(maintenance.id)}
                  className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}