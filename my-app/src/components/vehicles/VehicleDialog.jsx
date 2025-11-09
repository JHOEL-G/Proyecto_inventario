import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DialogDescription } from '../ui/dialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";

export default function VehicleDialog({ open, onOpenChange, vehicle, onSave, isSaving, clients, brands, models }) {
  const [modelOptions, setModelOptions] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    brandId: '',
    modelId: '',
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

  // ------------------------------ Transformaciones ------------------------------
  const transformFromBackend = (backendData) => {
    if (!backendData) return null;
    const statusMap = { 0: 'disponible', 1: 'vendido', 2: 'en_mantenimiento', 3: 'reservado' };
    const fuelTypeMap = { 0: 'gasolina', 1: 'diesel', 2: 'electrico', 3: 'hibrido', 4: 'gas' };
    const transmissionMap = { 0: 'manual', 1: 'automatica', 2: 'semiautomatica', 3: 'cvt' };

    return {
      brandId: brands?.find(b => b.name === backendData.brand)?.id?.toString() || '',
      modelId: models?.find(m => m.name === backendData.model)?.id?.toString() || '',
      year: backendData.year || new Date().getFullYear(),
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

  const transformToBackend = (frontendData) => {
    const statusMap = { 'disponible': 0, 'vendido': 1, 'en_mantenimiento': 2, 'reservado': 3 };
    const fuelTypeMap = { 'gasolina': 0, 'diesel': 1, 'electrico': 2, 'hibrido': 3, 'gas': 4 };
    const transmissionMap = { 'manual': 0, 'automatica': 1, 'semiautomatica': 2, 'cvt': 3 };

    return {
      brandId: frontendData.brandId,
      modelId: frontendData.modelId,
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

  // ------------------------------ Efectos ------------------------------
  useEffect(() => {
  const loadModels = async (brandId) => {
    if (!brandId) {
      setModelOptions([]);
      setFormData(prev => ({ ...prev, modelId: '' }));
      return;
    }

    try {
      const modelsFromApi = await base44.entities.Brand.getModels(brandId);
      setModelOptions(modelsFromApi);

      // Si el modelo actual no existe en la lista, limpiar modelId
      setFormData(prev => ({
        ...prev,
        modelId: modelsFromApi.find(m => m.id.toString() === prev.modelId)?.id.toString() || ''
      }));
    } catch (err) {
      console.error("Error cargando modelos:", err);
      setModelOptions([]);
    }
  };

  if (!vehicle) {
    // Nuevo vehículo
    setFormData({
      brandId: '',
      modelId: '',
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
    setModelOptions([]);
  } else {
    // Editar vehículo
    const statusMap = { 0:'disponible',1:'vendido',2:'en_mantenimiento',3:'reservado' };
    const fuelTypeMap = { 0:'gasolina',1:'diesel',2:'electrico',3:'hibrido',4:'gas' };
    const transmissionMap = { 0:'manual',1:'automatica',2:'semiautomatica',3:'cvt' };

    const brandId = brands.find(b => b.name === vehicle.brand)?.id?.toString() || '';

    setFormData({
      brandId,
      modelId: '', // temporal, se asigna tras cargar modelos
      year: vehicle.year || new Date().getFullYear(),
      serial_number: vehicle.serialNumber || '',
      license_plate: vehicle.licensePlate || '',
      color: vehicle.color || '',
      status: statusMap[vehicle.status] || 'disponible',
      location: vehicle.location || '',
      purchase_price: vehicle.purchasePrice?.toString() || '',
      sale_price: vehicle.salePrice?.toString() || '',
      mileage: vehicle.mileage?.toString() || '',
      fuel_type: fuelTypeMap[vehicle.fuelType] || 'gasolina',
      transmission: transmissionMap[vehicle.transmission] || 'manual',
      image_url: vehicle.imageUrl || '',
      notes: vehicle.notes || '',
      owner_id: vehicle.ownerId || ''
    });

    // Cargar modelos y asignar el correcto
    loadModels(brandId);
  }
}, [vehicle, brands]);



  useEffect(() => {
    if (!formData.brandId) {
      setModelOptions([]);
      setFormData(prev => ({ ...prev, modelId: '' }));
      return;
    }

    const fetchModels = async () => {
      try {
        const modelsFromApi = await base44.entities.Brand.getModels(formData.brandId);
        setModelOptions(modelsFromApi);
        if (!modelsFromApi.find(m => m.id.toString() === formData.modelId)) {
          setFormData(prev => ({ ...prev, modelId: '' }));
        }
      } catch (err) {
        console.error('Error fetching models:', err);
        setModelOptions([]);
      }
    };

    fetchModels();
  }, [formData.brandId]);

  // ------------------------------ Handlers ------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    const backendData = transformToBackend(formData);
    onSave(backendData);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { imageUrl } = await base44.entities.Vehicle.uploadImage(file);
      setFormData({ ...formData, image_url: imageUrl });
    } catch (error) {
      console.error("Error subiendo la imagen:", error);
    } finally {
      setUploading(false);
    }
  };

  // ------------------------------ Render ------------------------------
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {vehicle ? 'Editar Vehículo' : 'Agregar Vehículo'}
          </DialogTitle>
          <DialogDescription>
            {vehicle ? 'Modifica los datos del vehículo' : 'Completa el formulario para agregar un nuevo vehículo'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ----------------- GRID PRINCIPAL ----------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Marca */}
            <div className="space-y-2">
              <Label>Marca *</Label>
              <Select
                value={formData.brandId}
                onValueChange={(v) => setFormData({ ...formData, brandId: v })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una marca" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg">
                  {brands?.map((b) => (
                    <SelectItem
                      key={b.id}
                      value={b.id.toString()}
                      className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-blue-200 transition-colors"
                    >
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Modelo */}
            <div className="space-y-2">
              <Label>Modelo *</Label>
              <Select
                value={formData.modelId}
                onValueChange={(v) => setFormData({ ...formData, modelId: v })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Buscando un modelo" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg">
                  {modelOptions.map(m => (
                    <SelectItem
                      key={m.id}
                      value={m.id.toString()}
                      className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-blue-200 transition-colors"
                    >
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Año */}
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

            {/* Número de serie */}
            <div className="space-y-2">
              <Label htmlFor="serial_number">Número de Serie / VIN *</Label>
              <Input
                id="serial_number"
                value={formData.serial_number}
                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                required
              />
            </div>

            {/* Matrícula */}
            <div className="space-y-2">
              <Label htmlFor="license_plate">Matrícula / Placa</Label>
              <Input
                id="license_plate"
                value={formData.license_plate}
                onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
              />
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border dark:border-gray-700 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors">
                  <SelectValue placeholder="Seleccione el estado" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg">
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                  <SelectItem value="en_mantenimiento">En Mantenimiento</SelectItem>
                  <SelectItem value="reservado">Reservado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ubicación */}
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            {/* Kilometraje */}
            <div className="space-y-2">
              <Label htmlFor="mileage">Kilometraje</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
              />
            </div>

            {/* Combustible */}
            <div className="space-y-2">
              <Label htmlFor="fuel_type">Combustible</Label>
              <Select
                value={formData.fuel_type}
                onValueChange={(value) => setFormData({ ...formData, fuel_type: value })}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border dark:border-gray-700 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors">
                  <SelectValue placeholder="Tipo de combustible" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg">
                  <SelectItem value="gasolina">Gasolina</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electrico">Eléctrico</SelectItem>
                  <SelectItem value="hibrido">Híbrido</SelectItem>
                  <SelectItem value="gas">Gas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transmisión */}
            <div className="space-y-2">
              <Label htmlFor="transmission">Transmisión</Label>
              <Select
                value={formData.transmission}
                onValueChange={(value) => setFormData({ ...formData, transmission: value })}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border dark:border-gray-700 data-[state=open]:bg-blue-50 dark:data-[state=open]:bg-blue-900 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors">
                  <SelectValue placeholder="Seleccione la transmisión" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg">
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automatica">Automática</SelectItem>
                  <SelectItem value="semiautomatica">Semiautomática</SelectItem>
                  <SelectItem value="cvt">CVT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Precio de Compra */}
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

            {/* Precio de Venta */}
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

            {/* Propietario */}
            <div className="space-y-2">
              <Label htmlFor="owner_id">Propietario</Label>
              <Select
                value={formData.owner_id || "none"}
                onValueChange={(value) => setFormData({ ...formData, owner_id: value === "none" ? '' : value })}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border dark:border-gray-700 data-[state=open]:bg-blue-50 dark:data-[state=open]:bg-blue-900 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors">
                  <SelectValue placeholder="Seleccionar el cliente" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg">
                  <SelectItem value="none">Sin propietario</SelectItem>
                  {clients?.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ----------------- Imagen ----------------- */}
          <div className="space-y-2">
            <Label htmlFor="image">Imagen del Vehículo</Label>
            <div className="flex gap-2 items-center">
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
              <div className="mt-2 flex flex-col items-start gap-2">
                <img src={formData.image_url} alt="Preview" className="h-32 w-auto rounded-lg" />
                <Button type="button" variant="destructive" size="sm" onClick={() => setFormData({ ...formData, image_url: '' })}>
                  Eliminar Imagen
                </Button>
              </div>
            )}
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea id="notes" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} rows={3} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-blue-600 to-blue-700">
              {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {vehicle ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
