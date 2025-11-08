import React from 'react';
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Edit, Trash2, MapPin, Gauge, Car } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_CONFIG = {
  'disponible': { color: 'bg-green-100 text-green-800 border-green-200', label: 'Disponible' },
  'vendido': { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Vendido' },
  'en_mantenimiento': { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'En Mantenimiento' },
  'reservado': { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Reservado' }
};

export default function VehicleGrid({ vehicles, isLoading, onEdit, onDelete, clients }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-16">
        <Car className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <p className="text-slate-500 text-lg">No se encontraron vehículos</p>
      </div>
    );
  }

  const getClientName = (ownerId) => {
    const client = clients.find(c => c.id === ownerId);
    return client?.full_name || null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {vehicles.map((vehicle) => {
          const statusConfig = STATUS_CONFIG[vehicle.status] || STATUS_CONFIG['disponible'];
          const clientName = getClientName(vehicle.owner_id);

          return (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group">
                <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                  {vehicle.image_url ? (
                    <img
                      src={vehicle.image_url}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-16 h-16 text-slate-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className={`${statusConfig.color} border backdrop-blur-sm`}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {vehicle.year} • {vehicle.color}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    {vehicle.license_plate && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="font-mono bg-slate-100 px-2 py-1 rounded">{vehicle.license_plate}</span>
                      </div>
                    )}
                    {vehicle.mileage && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Gauge className="w-4 h-4" />
                        <span>{vehicle.mileage.toLocaleString()} km</span>
                      </div>
                    )}
                    {vehicle.location && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span>{vehicle.location}</span>
                      </div>
                    )}
                    {clientName && (
                      <div className="text-sm text-slate-600">
                        <span className="font-medium">Propietario:</span> {clientName}
                      </div>
                    )}
                  </div>

                  {vehicle.sale_price && (
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-green-600">
                        ${vehicle.sale_price.toLocaleString()}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                      onClick={() => onEdit(vehicle)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      onClick={() => onDelete(vehicle.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}