import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Skeleton } from "../ui/skeleton";

const COLORS = {
  'disponible': 'blue',
  'vendido': 'gray',
  'en_mantenimiento': 'black',
  'reservado': 'violet'
};

const STATUS_LABELS = {
  'disponible': 'Disponible',
  'vendido': 'Vendido',
  'en_mantenimiento': 'En Mantenimiento',
  'reservado': 'Reservado'
};

export default function VehicleStatusChart({ vehicles, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle>Estado de Vehículos</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const statusCounts = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: STATUS_LABELS[status] || status,
    value: count,
    color: COLORS[status] || 'violet'
  }));

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
              <Tooltip />
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