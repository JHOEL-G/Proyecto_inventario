import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";
import { DialogDescription } from '../ui/dialog';

export default function VehicleDialog({ open, onOpenChange, vehicle, onSave, isSaving, clients }) {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    serial_number: '',
    license_plate: '',
    color: '',
    status: 'disponible',
    location: '',
    purchase_price: '',
    sale_price: '',
    mileage: '',
    fuel_type: 'gasolina',
    transmission: 'manual',
    image_url: '',
    notes: '',
    owner_id: ''
  });

  const [uploading, setUploading] = useState(false);

  // Función para convertir datos del backend al formato del frontend
  const transformFromBackend = (backendData) => {
    if (!backendData) return null;

    const statusMap = {
      0: 'disponible',
      1: 'vendido',
      2: 'en_mantenimiento',
      3: 'reservado'
    };

    const fuelTypeMap = {
      0: 'gasolina',
      1: 'diesel',
      2: 'electrico',
      3: 'hibrido',
      4: 'gas'
    };

    const transmissionMap = {
      0: 'manual',
      1: 'automatica',
      2: 'semiautomatica',
      3: 'cvt'
    };

    return {
      brand: backendData.brand || '',
      model: backendData.model || '',
      year: backendData.year || new Date().getFullYear(),
      serial_number: backendData.serialNumber || '',
      license_plate: backendData.licensePlate || '',
      color: backendData.color || '',
      status: statusMap[backendData.status] || 'disponible',
      location: backendData.location || '',
      purchase_price: backendData.purchasePrice?.toString() || '',
      sale_price: backendData.salePrice?.toString() || '',
      mileage: backendData.mileage?.toString() || '',
      fuel_type: fuelTypeMap[backendData.fuelType] || 'gasolina',
      transmission: transmissionMap[backendData.transmission] || 'manual',
      image_url: backendData.imageUrl || '',
      notes: backendData.notes || '',
      owner_id: backendData.ownerId || ''
    };
  };

  // Función para convertir datos del frontend al formato del backend
  const transformToBackend = (frontendData) => {
    const statusMap = {
      'disponible': 0,
      'vendido': 1,
      'en_mantenimiento': 2,
      'reservado': 3
    };

    const fuelTypeMap = {
      'gasolina': 0,
      'diesel': 1,
      'electrico': 2,
      'hibrido': 3,
      'gas': 4
    };

    const transmissionMap = {
      'manual': 0,
      'automatica': 1,
      'semiautomatica': 2,
      'cvt': 3
    };

    return {
      brand: frontendData.brand,
      model: frontendData.model,
      year: parseInt(frontendData.year) || new Date().getFullYear(),
      serialNumber: frontendData.serial_number,
      licensePlate: frontendData.license_plate || null,
      color: frontendData.color || null,
      status: statusMap[frontendData.status] ?? 0,
      location: frontendData.location || null,
      purchasePrice: frontendData.purchase_price ? parseFloat(frontendData.purchase_price) : 0,
      salePrice: frontendData.sale_price ? parseFloat(frontendData.sale_price) : 0,
      mileage: frontendData.mileage ? parseFloat(frontendData.mileage) : 0,
      fuelType: fuelTypeMap[frontendData.fuel_type] ?? 0,
      transmission: transmissionMap[frontendData.transmission] ?? 0,
      imageUrl: frontendData.image_url || null,
      notes: frontendData.notes || null,
      ownerId: frontendData.owner_id || null
    };
  };

  useEffect(() => {
    if (vehicle) {
      // Si hay un vehículo, transformarlo del formato backend
      const transformedData = transformFromBackend(vehicle);
      setFormData(transformedData || {
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        serial_number: '',
        license_plate: '',
        color: '',
        status: 'disponible',
        location: '',
        purchase_price: '',
        sale_price: '',
        mileage: '',
        fuel_type: 'gasolina',
        transmission: 'manual',
        image_url: '',
        notes: '',
        owner_id: ''
      });
    } else {
      // Resetear formulario
      setFormData({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        serial_number: '',
        license_plate: '',
        color: '',
        status: 'disponible',
        location: '',
        purchase_price: '',
        sale_price: '',
        mileage: '',
        fuel_type: 'gasolina',
        transmission: 'manual',
        image_url: '',
        notes: '',
        owner_id: ''
      });
    }
  }, [vehicle, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Transformar al formato del backend antes de enviar
    const backendData = transformToBackend(formData);
    onSave(backendData);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.entities.Vehicle.create({ file });
      setFormData({ ...formData, image_url: file_url });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    setUploading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {vehicle ? 'Editar Vehículo' : 'Agregar Vehículo'}
          </DialogTitle>
          <DialogDescription>
    {vehicle ? 'Modifica los datos del vehículo' : 'Completa el formulario para agregar un nuevo vehículo'}
  </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Marca *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Modelo *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Año *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serial_number">Número de Serie / VIN *</Label>
              <Input
                id="serial_number"
                value={formData.serial_number}
                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license_plate">Matrícula / Placa</Label>
              <Input
                id="license_plate"
                value={formData.license_plate}
                onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                  <SelectItem value="en_mantenimiento">En Mantenimiento</SelectItem>
                  <SelectItem value="reservado">Reservado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mileage">Kilometraje</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuel_type">Combustible</Label>
              <Select value={formData.fuel_type} onValueChange={(value) => setFormData({ ...formData, fuel_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasolina">Gasolina</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electrico">Eléctrico</SelectItem>
                  <SelectItem value="hibrido">Híbrido</SelectItem>
                  <SelectItem value="gas">Gas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transmission">Transmisión</Label>
              <Select value={formData.transmission} onValueChange={(value) => setFormData({ ...formData, transmission: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automatica">Automática</SelectItem>
                  <SelectItem value="semiautomatica">Semiautomática</SelectItem>
                  <SelectItem value="cvt">CVT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchase_price">Precio de Compra</Label>
              <Input
                id="purchase_price"
                type="number"
                step="0.01"
                value={formData.purchase_price}
                onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sale_price">Precio de Venta</Label>
              <Input
                id="sale_price"
                type="number"
                step="0.01"
                value={formData.sale_price}
                onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner_id">Propietario</Label>
              <Select 
                value={formData.owner_id || "none"} 
                onValueChange={(value) => setFormData({ ...formData, owner_id: value === "none" ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin propietario</SelectItem>
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Imagen del Vehículo</Label>
            <div className="flex gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && <Loader2 className="w-6 h-6 animate-spin" />}
            </div>
            {formData.image_url && (
              <img src={formData.image_url} alt="Preview" className="h-32 w-auto rounded-lg mt-2" />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-blue-600 to-blue-700">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {vehicle ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}