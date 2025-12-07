import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function MaintenanceDialog({ open, onOpenChange, maintenance, vehicles, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    vehicle_id: '',
    maintenance_type: 'preventivo', // <-- vacio
    service_date: new Date().toISOString().split('T')[0],
    next_service_date: '',
    description: '',
    parts_replaced: '',
    cost: '',
    mechanic: '',
    mileage_at_service: '',
    status: 'pendiente',
    priority: 'media'
  });


  const maintenanceTypeMapReverse = {
    0: 'preventivo',
    1: 'correctivo',
    2: 'revision',
    3: 'reparacion'
  };


  useEffect(() => {
    if (maintenance) {
      const serviceDate = maintenance.serviceDate ? new Date(maintenance.serviceDate).toISOString().split('T')[0] : '';
      const nextServiceDate = maintenance.nextServiceDate ? new Date(maintenance.nextServiceDate).toISOString().split('T')[0] : '';

      setFormData({
        ...maintenance,
        vehicle_id: String(maintenance.vehicleId),
        maintenance_type: maintenanceTypeMapReverse[maintenance.maintenanceType] || 'preventivo',
        service_date: serviceDate,
        next_service_date: nextServiceDate
      });
    } else {
      setFormData({
        vehicle_id: '',
        maintenance_type: 'preventivo',
        service_date: new Date().toISOString().split('T')[0],
        next_service_date: '',
        description: '',
        parts_replaced: '',
        cost: '',
        mechanic: '',
        mileage_at_service: '',
        status: 'pendiente',
        priority: 'media'
      });
    }
  }, [maintenance, open]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.vehicle_id || !formData.service_date || !formData.description) {
      alert('Completa los campos requeridos: Vehículo, Fecha de Servicio y Descripción.');
      return;
    }

    let dataToSave = { ...formData };
    if (maintenance && maintenance.id) dataToSave.id = maintenance.id;

    if (dataToSave.service_date) dataToSave.service_date = new Date(dataToSave.service_date + 'T00:00:00').toISOString();
    if (dataToSave.next_service_date) dataToSave.next_service_date = new Date(dataToSave.next_service_date + 'T00:00:00').toISOString();
    else delete dataToSave.next_service_date;

    const backendData = {
      id: dataToSave.id,
      vehicle_id: parseInt(dataToSave.vehicle_id) || 0,
      maintenance_type: mapMaintenanceType(dataToSave.maintenance_type),
      service_date: dataToSave.service_date,
      next_service_date: dataToSave.next_service_date,
      description: dataToSave.description || '',
      parts_replaced: dataToSave.parts_replaced || '',
      cost: parseFloat(dataToSave.cost) || 0,
      mechanic: dataToSave.mechanic || '',
      mileage_at_service: parseInt(dataToSave.mileage_at_service) || 0,
      status: dataToSave.status,
      priority: dataToSave.priority,
    };

    onSave(backendData);
  };

  const mapMaintenanceType = (type) => {
    const map = { 'preventivo': 0, 'correctivo': 1, 'revision': 2, 'reparacion': 3 };
    return map[type] || 0;
  };


  const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).replace('_', ' ');
  };

  const comboItemClass = "cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-blue-200 transition-colors";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-gray-900 rounded-xl shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {maintenance ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vehículo */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="vehicle_id">Vehículo *</Label>
              <Select
                value={String(formData.vehicle_id)}
                onValueChange={(value) => setFormData({ ...formData, vehicle_id: value })}
                required
              >
                <SelectTrigger className="bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Seleccionar vehículo" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 rounded-md shadow-md">
                  {vehicles.map((vehicle) => (
                    <SelectItem
                      key={vehicle.id}
                      value={String(vehicle.id)}
                      className={comboItemClass}
                    >
                      {vehicle.brandName} {vehicle.modelName} - {vehicle.license_plate || vehicle.serial_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de mantenimiento */}
            <div className="space-y-2">
              <Label htmlFor="maintenance_type">Tipo de Mantenimiento *</Label>
              <Select
                value={formData.maintenance_type}
                onValueChange={(value) => setFormData({ ...formData, maintenance_type: value })}
              >
                <SelectTrigger className="bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 rounded-md shadow-md">
                  <SelectItem value="preventivo" className={comboItemClass}>Preventivo</SelectItem>
                  <SelectItem value="correctivo" className={comboItemClass}>Correctivo</SelectItem>
                  <SelectItem value="revision" className={comboItemClass}>Revisión</SelectItem>
                  <SelectItem value="reparacion" className={comboItemClass}>Reparación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 rounded-md shadow-md">
                  <SelectItem value="pendiente" className={comboItemClass}>Pendiente</SelectItem>
                  <SelectItem value="en_progreso" className={comboItemClass}>En Progreso</SelectItem>
                  <SelectItem value="completado" className={comboItemClass}>Completado</SelectItem>
                  <SelectItem value="cancelado" className={comboItemClass}>Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prioridad */}
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger className="bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 rounded-md shadow-md">
                  <SelectItem value="baja" className={comboItemClass}>Baja</SelectItem>
                  <SelectItem value="media" className={comboItemClass}>Media</SelectItem>
                  <SelectItem value="alta" className={comboItemClass}>Alta</SelectItem>
                  <SelectItem value="urgente" className={comboItemClass}>Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resto de inputs y textarea */}
            <div className="space-y-2">
              <Label htmlFor="service_date">Fecha de Servicio *</Label>
              <Input
                id="service_date"
                type="date"
                value={formData.service_date}
                onChange={(e) => setFormData({ ...formData, service_date: e.target.value })}
                required
                className="bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_service_date">Próximo Servicio</Label>
              <Input
                id="next_service_date"
                type="date"
                value={formData.next_service_date}
                onChange={(e) => setFormData({ ...formData, next_service_date: e.target.value })}
                className="bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Costo</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage_at_service">Kilometraje</Label>
              <Input
                id="mileage_at_service"
                type="number"
                value={formData.mileage_at_service}
                onChange={(e) => setFormData({ ...formData, mileage_at_service: e.target.value })}
                className="bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="mechanic">Mecánico</Label>
              <Input
                id="mechanic"
                value={formData.mechanic}
                onChange={(e) => setFormData({ ...formData, mechanic: e.target.value })}
                className="bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
                className="bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="parts_replaced">Partes Reemplazadas</Label>
              <Textarea
                id="parts_replaced"
                value={formData.parts_replaced}
                onChange={(e) => setFormData({ ...formData, parts_replaced: e.target.value })}
                rows={2}
                className="bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-blue-600 to-blue-700">
              {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {maintenance ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
