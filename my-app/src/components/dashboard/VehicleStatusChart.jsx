import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Skeleton } from "../ui/skeleton";

const COLORS = {
  'disponible': '#10B981', 
  'vendido': '#64748B',    
  'en_mantenimiento': '#EF4444', 
  'reservado': '#3B82F6'    
};
const STATUS_LABELS = {
  'disponible': 'Disponible',
  'vendido': 'Vendido',
  'en_mantenimiento': 'En Mantenimiento',
  'reservado': 'Reservado'
};

// 1. Mapa inverso para transformar el número del backend a la clave del frontend (string)
const STATUS_MAP = {
    0: 'disponible',
    1: 'vendido',
    2: 'en_mantenimiento',
    3: 'reservado'
};

export default function VehicleStatusChart({ vehicles, isLoading }) {
// ... (código de loading)

  // Paso 1: Transformar los estados numéricos (si existen) a strings legibles
  const vehiclesWithMappedStatus = vehicles.map(v => ({
    ...v,
    // Verifica si el status es un número (o string numérico) y lo mapea
    status: STATUS_MAP[v.status] || v.status
  }));

  // 2. Contar los estados usando la nueva lista mapeada
  const statusCounts = vehiclesWithMappedStatus.reduce((acc, vehicle) => {
    // Ahora vehicle.status será un string como 'en_mantenimiento'
    acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
    return acc;
  }, {});

  // 3. Mapear los conteos a la estructura de datos del gráfico
  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    // 'status' aquí ya es el string (ej: 'en_mantenimiento')
    name: STATUS_LABELS[status] || status, 
    value: count,
    // Si el estado es 'en_mantenimiento', buscará COLORS['en_mantenimiento']
    color: COLORS[status] || '#64748B' // Usamos un gris como fallback
  }));

  // ... (código de renderizado)
  
  return (
    <Card className="shadow-lg border-slate-200 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xl font-bold text-slate-900">Estado de Vehículos</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} 
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {/* Tooltip y Legend funcionarán correctamente con 'name' como string */}
              <Tooltip formatter={(value, name) => [value, name]} /> 
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-500">
            No hay datos disponibles
          </div>
        )}
      </CardContent>
    </Card>
  );
}