import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MaintenanceFilters({ filters, setFilters }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={filters.status}
        onValueChange={(value) => setFilters({ ...filters, status: value })}
      >
        <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm border-slate-200">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="pendiente">Pendiente</SelectItem>
          <SelectItem value="en_progreso">En Progreso</SelectItem>
          <SelectItem value="completado">Completado</SelectItem>
          <SelectItem value="cancelado">Cancelado</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.maintenance_type}
        onValueChange={(value) => setFilters({ ...filters, maintenance_type: value })}
      >
        <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm border-slate-200">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="preventivo">Preventivo</SelectItem>
          <SelectItem value="correctivo">Correctivo</SelectItem>
          <SelectItem value="revision">Revisión</SelectItem>
          <SelectItem value="reparacion">Reparación</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priority}
        onValueChange={(value) => setFilters({ ...filters, priority: value })}
      >
        <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm border-slate-200">
          <SelectValue placeholder="Prioridad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          <SelectItem value="baja">Baja</SelectItem>
          <SelectItem value="media">Media</SelectItem>
          <SelectItem value="alta">Alta</SelectItem>
          <SelectItem value="urgente">Urgente</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}