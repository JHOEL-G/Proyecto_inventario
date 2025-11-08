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

  useEffect(() => {
    if (maintenance) {
      // Si es edición, convierte las fechas del backend al formato del input
      const serviceDate = maintenance.service_date ? new Date(maintenance.service_date).toISOString().split('T')[0] : '';
      const nextServiceDate = maintenance.next_service_date ? new Date(maintenance.next_service_date).toISOString().split('T')[0] : '';
      
      setFormData({
        ...maintenance,
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
    
    // Validación simple
    if (!formData.vehicle_id || !formData.service_date || !formData.description) {
      alert('Completa los campos requeridos: Vehículo, Fecha de Servicio y Descripción.');
      return;
    }

    // Prepara los datos para enviar al backend
    let dataToSave = { ...formData };
    
    // Si es edición, incluye el id
    if (maintenance && maintenance.id) {
      dataToSave.id = maintenance.id;
    }

    // CLAVE: Convierte las fechas al formato ISO completo que espera el backend
    if (dataToSave.service_date) {
      dataToSave.service_date = new Date(dataToSave.service_date + 'T00:00:00').toISOString();
    }
    
    if (dataToSave.next_service_date) {
      dataToSave.next_service_date = new Date(dataToSave.next_service_date + 'T00:00:00').toISOString();
    } else {
      delete dataToSave.next_service_date;
    }

    // Mapea los nombres de campos del frontend al backend
    const backendData = {
      id: dataToSave.id,
      vehicleId: parseInt(dataToSave.vehicle_id) || 0,
      maintenanceType: mapMaintenanceType(dataToSave.maintenance_type),
      serviceDate: dataToSave.service_date,
      nextServiceDate: dataToSave.next_service_date,
      description: dataToSave.description || '',
      partsReplaced: dataToSave.parts_replaced || '',
      cost: parseFloat(dataToSave.cost) || 0,
      mechanic: dataToSave.mechanic || '',
      mileageAtService: parseInt(dataToSave.mileage_at_service) || 0,
      status: capitalizeFirst(dataToSave.status),
      priority: capitalizeFirst(dataToSave.priority)
    };

    console.log('Enviando al backend:', backendData);
    onSave(backendData);
  };

  // Mapea los valores del frontend a los valores del backend (enum)
  const mapMaintenanceType = (type) => {
    const map = {
      'preventivo': 0,
      'correctivo': 1,
      'revision': 2,
      'reparacion': 3
    };
    return map[type] || 0;
  };

  // Capitaliza la primera letra para el backend
  const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).replace('_', ' ');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {maintenance ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="vehicle_id">Vehículo *</Label>
              <Select value={String(formData.vehicle_id)} onValueChange={(value) => setFormData({ ...formData, vehicle_id: value })} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar vehículo" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={String(vehicle.id)}>
                      {vehicle.brand} {vehicle.model} - {vehicle.license_plate || vehicle.serial_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maintenance_type">Tipo de Mantenimiento *</Label>
              <Select value={formData.maintenance_type} onValueChange={(value) => setFormData({ ...formData, maintenance_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preventivo">Preventivo</SelectItem>
                  <SelectItem value="correctivo">Correctivo</SelectItem>
                  <SelectItem value="revision">Revisión</SelectItem>
                  <SelectItem value="reparacion">Reparación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en_progreso">En Progreso</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service_date">Fecha de Servicio *</Label>
              <Input
                id="service_date"
                type="date"
                value={formData.service_date}
                onChange={(e) => setFormData({ ...formData, service_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_service_date">Próximo Servicio</Label>
              <Input
                id="next_service_date"
                type="date"
                value={formData.next_service_date}
                onChange={(e) => setFormData({ ...formData, next_service_date: e.target.value })}
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage_at_service">Kilometraje</Label>
              <Input
                id="mileage_at_service"
                type="number"
                value={formData.mileage_at_service}
                onChange={(e) => setFormData({ ...formData, mileage_at_service: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="mechanic">Mecánico</Label>
              <Input
                id="mechanic"
                value={formData.mechanic}
                onChange={(e) => setFormData({ ...formData, mechanic: e.target.value })}
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
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="parts_replaced">Partes Reemplazadas</Label>
              <Textarea
                id="parts_replaced"
                value={formData.parts_replaced}
                onChange={(e) => setFormData({ ...formData, parts_replaced: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-blue-600 to-blue-700">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {maintenance ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}