import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Calendar, DollarSign } from "lucide-react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Reports() {
  const [exportLoading, setExportLoading] = useState(false);

  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => base44.entities.Vehicle.list(),
  });

  const { data: maintenances = [] } = useQuery({
    queryKey: ['maintenances'],
    queryFn: () => base44.entities.Maintenance.list(),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
  });

  const exportToExcel = () => {
    setExportLoading(true);
    
    const vehiclesData = vehicles.map(v => ({
      'Marca': v.brand,
      'Modelo': v.model,
      'Año': v.year,
      'Número de Serie': v.serial_number,
      'Placa': v.license_plate || '',
      'Estado': v.status,
      'Precio Venta': v.sale_price || 0,
      'Kilometraje': v.mileage || 0,
      'Ubicación': v.location || ''
    }));

    const maintenanceData = maintenances.map(m => {
      const vehicle = vehicles.find(v => v.id === m.vehicle_id);
      return {
        'Vehículo': vehicle ? `${vehicle.brand} ${vehicle.model}` : '',
        'Tipo': m.maintenance_type,
        'Fecha': m.service_date,
        'Estado': m.status,
        'Costo': m.cost || 0,
        'Descripción': m.description
      };
    });

    const csvVehicles = [
      Object.keys(vehiclesData[0] || {}).join(','),
      ...vehiclesData.map(row => Object.values(row).map(v => JSON.stringify(v)).join(','))
    ].join('\n');

    const csvMaintenance = [
      Object.keys(maintenanceData[0] || {}).join(','),
      ...maintenanceData.map(row => Object.values(row).map(v => JSON.stringify(v)).join(','))
    ].join('\n');

    const blob1 = new Blob([csvVehicles], { type: 'text/csv;charset=utf-8;' });
    const blob2 = new Blob([csvMaintenance], { type: 'text/csv;charset=utf-8;' });
    
    const link1 = document.createElement('a');
    link1.href = URL.createObjectURL(blob1);
    link1.download = `vehiculos_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link1.click();

    setTimeout(() => {
      const link2 = document.createElement('a');
      link2.href = URL.createObjectURL(blob2);
      link2.download = `mantenimientos_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      link2.click();
      setExportLoading(false);
    }, 500);
  };

  const maintenanceCostsByMonth = maintenances.reduce((acc, m) => {
    if (!m.cost || !m.service_date) return acc;
    const month = format(new Date(m.service_date), 'MMM yyyy', { locale: es });
    acc[month] = (acc[month] || 0) + m.cost;
    return acc;
  }, {});

  const costChartData = Object.entries(maintenanceCostsByMonth).map(([month, cost]) => ({
    month,
    cost
  })).slice(-6);

  const vehiclesByBrand = vehicles.reduce((acc, v) => {
    acc[v.brand] = (acc[v.brand] || 0) + 1;
    return acc;
  }, {});

  const brandChartData = Object.entries(vehiclesByBrand).map(([brand, count]) => ({
    brand,
    count
  }));

  const totalMaintenanceCost = maintenances.reduce((sum, m) => sum + (m.cost || 0), 0);
  const totalVehicleValue = vehicles.reduce((sum, v) => sum + (v.sale_price || 0), 0);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Reportes y Estadísticas
          </h1>
          <p className="text-slate-600 mt-1">Análisis completo del sistema</p>
        </div>
        <Button 
          onClick={exportToExcel}
          disabled={exportLoading}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-500/30"
        >
          {exportLoading ? (
            <>Exportando...</>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Exportar a Excel
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Vehículos</p>
                <p className="text-3xl font-bold text-slate-900">{vehicles.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Costo Mantenimiento</p>
                <p className="text-3xl font-bold text-orange-600">${totalMaintenanceCost.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Valor Inventario</p>
                <p className="text-3xl font-bold text-green-600">${totalVehicleValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100">
            <CardTitle>Costos de Mantenimiento (Últimos 6 Meses)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={costChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="cost" stroke="#f59e0b" name="Costo" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100">
            <CardTitle>Vehículos por Marca</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={brandChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="brand" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-100">
          <CardTitle>Resumen de Datos</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 font-medium">Clientes Totales</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{clients.length}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 font-medium">Vehículos Disponibles</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {vehicles.filter(v => v.status === 'disponible').length}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-700 font-medium">Mantenimientos Totales</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{maintenances.length}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-700 font-medium">Mantenimientos Pendientes</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {maintenances.filter(m => m.status === 'pendiente' || m.status === 'en_progreso').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}