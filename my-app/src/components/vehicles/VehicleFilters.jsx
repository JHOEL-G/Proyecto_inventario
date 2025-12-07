import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function VehicleFilters({ filters, setFilters }) {

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="flex flex-wrap gap-3">

      <Select
        value={filters.status}
        onValueChange={(value) => handleFilterChange('status', value)}
      >
        <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm border-slate-200">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="disponible">Disponible</SelectItem>
          <SelectItem value="vendido">Vendido</SelectItem>
          <SelectItem value="en_mantenimiento">En Mantenimiento</SelectItem>
          <SelectItem value="reservado">Reservado</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.fuel_type}
        onValueChange={(value) => handleFilterChange('fuel_type', value)}
      >
        <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm border-slate-200">
          <SelectValue placeholder="Combustible" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="gasolina">Gasolina</SelectItem>
          <SelectItem value="diesel">Diesel</SelectItem>
          <SelectItem value="electrico">Eléctrico</SelectItem>
          <SelectItem value="hibrido">Híbrido</SelectItem>
          <SelectItem value="gas">Gas</SelectItem>
        </SelectContent>
      </Select>

    </div>
  );
}