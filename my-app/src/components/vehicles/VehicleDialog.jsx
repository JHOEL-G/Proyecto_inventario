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
  const [uploadingDetailedImages, setUploadingDetailedImages] = useState(false);
  const [detailedImages, setDetailedImages] = useState([]);

  const [formData, setFormData] = useState({
    // Campos básicos (ya existentes)
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
    owner_id: '',

    // Campos nuevos agregados del DTO
    engine_number: '',
    registration_number: '',
    registration_card_url: '',
    insurance_policy_url: '',
    policy_expiration_date: '',
    invoice_url: '',
    verification_certificate_url: '',
    verification_sticker_color: '',
    passenger_capacity: '',
    tank_capacity_liters: '',
    cost_per_km: '',
    fuel_efficiency_kml: '',
    detailed_images: [] // Array de URLs o archivos para imágenes detalladas
  });

  // ------------------------------ Transformaciones (sin cambios) ------------------------------
  const transformFromBackend = (backendData) => {
    if (!backendData) return null;
    const statusMap = { 0: 'disponible', 1: 'vendido', 2: 'en_mantenimiento', 3: 'reservado' };
    const fuelTypeMap = { 0: 'gasolina', 1: 'diesel', 2: 'electrico', 3: 'hibrido', 4: 'gas' };
    const transmissionMap = { 0: 'manual', 1: 'automatica', 2: 'semiautomatica', 3: 'cvt' };

    // Imágenes detalladas: asumir que backendData.detailedImages es un array de { url: string }
    const detailedImagesUrls = backendData.detailedImages?.map(img => img.url) || [];

    return {
      // Campos básicos
      brandId: brands?.find(b => b.name === backendData.brandName)?.id?.toString() || '',
      modelId: models?.find(m => m.name === backendData.modelName)?.id?.toString() || '',
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
      owner_id: backendData.ownerId?.toString() || '',

      // Campos nuevos
      engine_number: backendData.engineNumber || '',
      registration_number: backendData.registrationNumber || '',
      registration_card_url: backendData.registrationCardUrl || '',
      insurance_policy_url: backendData.insurancePolicyUrl || '',
      policy_expiration_date: backendData.policyExpirationDate ? backendData.policyExpirationDate.split('T')[0] : '', // Solo fecha YYYY-MM-DD
      invoice_url: backendData.invoiceUrl || '',
      verification_certificate_url: backendData.verificationCertificateUrl || '',
      verification_sticker_color: backendData.verificationStickerColor || '',
      passenger_capacity: backendData.passengerCapacity?.toString() || '',
      tank_capacity_liters: backendData.tankCapacityLiters?.toString() || '',
      cost_per_km: backendData.costPerKm?.toString() || '',
      fuel_efficiency_kml: backendData.fuelEfficiencyKmL?.toString() || '',
      detailed_images: detailedImagesUrls
    };
  };

  const transformToBackend = (frontendData) => {
    const statusMap = { 'disponible': 0, 'vendido': 1, 'en_mantenimiento': 2, 'reservado': 3 };
    const fuelTypeMap = { 'gasolina': 0, 'diesel': 1, 'electrico': 2, 'hibrido': 3, 'gas': 4 };
    const transmissionMap = { 'manual': 0, 'automatica': 1, 'semiautomatica': 2, 'cvt': 3 };

    // Imágenes detalladas: enviar solo URLs (asumir que se suben por separado)
    const detailedImages = frontendData.detailed_images.map(url => ({ url }));

    return {
      // Campos básicos
      brandId: parseInt(frontendData.brandId) || 0,
      modelId: parseInt(frontendData.modelId) || 0,
      year: parseInt(frontendData.year) || new Date().getFullYear(),
      serialNumber: frontendData.serial_number || null,
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
      ownerId: frontendData.owner_id ? parseInt(frontendData.owner_id) : null,

      // Campos nuevos
      engineNumber: frontendData.engine_number || null,
      registrationNumber: frontendData.registration_number || null,
      registrationCardUrl: frontendData.registration_card_url || null,
      insurancePolicyUrl: frontendData.insurance_policy_url || null,
      policyExpirationDate: frontendData.policy_expiration_date ? new Date(frontendData.policy_expiration_date).toISOString() : null,
      invoiceUrl: frontendData.invoice_url || null,
      verificationCertificateUrl: frontendData.verification_certificate_url || null,
      verificationStickerColor: frontendData.verification_sticker_color || null,
      passengerCapacity: parseInt(frontendData.passenger_capacity) || 0,
      tankCapacityLiters: frontendData.tank_capacity_liters ? parseFloat(frontendData.tank_capacity_liters) : 0,
      costPerKm: frontendData.cost_per_km ? parseFloat(frontendData.cost_per_km) : 0,
      fuelEfficiencyKmL: frontendData.fuel_efficiency_kml ? parseFloat(frontendData.fuel_efficiency_kml) : 0,
      detailedImages
    };
  };

  // ------------------------------ Efectos y Handlers (sin cambios funcionales, solo los necesarios) ------------------------------

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
      // Nuevo vehículo: reset a defaults
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
        owner_id: '',
        // Nuevos campos a defaults
        engine_number: '',
        registration_number: '',
        registration_card_url: '',
        insurance_policy_url: '',
        policy_expiration_date: '',
        invoice_url: '',
        verification_certificate_url: '',
        verification_sticker_color: '',
        passenger_capacity: '',
        tank_capacity_liters: '',
        cost_per_km: '',
        fuel_efficiency_kml: '',
        detailed_images: []
      });
      setModelOptions([]);
      setDetailedImages([]);
    } else {
      // Editar vehículo: usar transformFromBackend para consistencia
      const transformed = transformFromBackend(vehicle);
      if (transformed) {
        setFormData(transformed);
        setDetailedImages(transformed.detailed_images || []);
      }

      // Cargar modelos basados en brandId del vehículo
      const brandId = transformed?.brandId || '';
      if (brandId) {
        loadModels(brandId);
      }
    }
  }, [vehicle, brands, models]); // Agregué models a deps para consistencia

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

  const handleDetailedImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDetailedImages(true);
    try {
      const { imageUrl } = await base44.entities.Vehicle.uploadImage(file); // Asumir mismo endpoint
      setDetailedImages(prev => [...prev, imageUrl]);
      setFormData(prev => ({ ...prev, detailed_images: [...prev.detailed_images, imageUrl] }));
    } catch (error) {
      console.error("Error subiendo imagen detallada:", error);
    } finally {
      setUploadingDetailedImages(false);
    }
  };

  const removeDetailedImage = (urlToRemove) => {
    setDetailedImages(prev => prev.filter(url => url !== urlToRemove));
    setFormData(prev => ({
      ...prev,
      detailed_images: prev.detailed_images.filter(url => url !== urlToRemove)
    }));
  };

  const handleFileUpload = async (field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Asumir un endpoint genérico para subir documentos (ajustar según tu API)
    try {
      // Mostrar un loader o indicador mientras sube el documento
      const { url } = await base44.entities.Vehicle.uploadDocument(file); // Nuevo método hipotético
      setFormData(prev => ({ ...prev, [field]: url }));
    } catch (error) {
      console.error(`Error subiendo ${field}:`, error);
    }
  };

  // ------------------------------ Render Mejorado ------------------------------
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Aumento a max-w-5xl y ajuste de clases para el scroll */}
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            {vehicle ? '🛠️ Editar Vehículo' : '🚗 Agregar Nuevo Vehículo'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {vehicle ? 'Modifica la información detallada del vehículo seleccionado.' : 'Completa todos los campos obligatorios (*) para ingresar un nuevo vehículo al inventario.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* ============================================================================================================== */}
          {/* ## 1. Información General y de Identificación 🆔 */}
          {/* ============================================================================================================== */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2 mb-4 text-gray-700 dark:text-gray-200">
              Datos Básicos y de Identificación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Marca, Modelo, Año (Bloque 1) */}
              <div className="space-y-2">
                <Label>Marca *</Label>
                <Select
                  value={formData.brandId}
                  onValueChange={(v) => setFormData({ ...formData, brandId: v })}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una marca" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {brands?.map((b) => (
                      <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Modelo *</Label>
                <Select
                  value={formData.modelId}
                  onValueChange={(v) => setFormData({ ...formData, modelId: v })}
                  required
                  disabled={!formData.brandId || modelOptions.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un modelo" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {modelOptions.map(m => (
                      <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Año *</Label>
                <Input
                  id="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || '' })}
                  required
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

              {/* Identificación (Bloque 2) */}
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
                <Label htmlFor="engine_number">Número de Motor</Label>
                <Input
                  id="engine_number"
                  value={formData.engine_number}
                  onChange={(e) => setFormData({ ...formData, engine_number: e.target.value })}
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
                <Label htmlFor="registration_number">Número de Registro</Label>
                <Input
                  id="registration_number"
                  value={formData.registration_number}
                  onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                />
              </div>

            </div>
          </div>
          
          <hr className="my-8 border-gray-200 dark:border-gray-700" />
          
          {/* ============================================================================================================== */}
          {/* ## 2. Estado y Datos Financieros 💰 */}
          {/* ============================================================================================================== */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2 mb-4 text-gray-700 dark:text-gray-200">
              Estado, Precios y Ubicación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger><SelectValue placeholder="Seleccione el estado" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="reservado">Reservado</SelectItem>
                    <SelectItem value="vendido">Vendido</SelectItem>
                    <SelectItem value="en_mantenimiento">En Mantenimiento</SelectItem>
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

              {/* Precio de Compra */}
              <div className="space-y-2">
                <Label htmlFor="purchase_price">Precio de Compra ($)</Label>
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
                <Label htmlFor="sale_price">Precio de Venta ($)</Label>
                <Input
                  id="sale_price"
                  type="number"
                  step="0.01"
                  value={formData.sale_price}
                  onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                />
              </div>

              {/* Propietario */}
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="owner_id">Propietario (Cliente)</Label>
                <Select
                  value={formData.owner_id || "none"}
                  onValueChange={(value) => setFormData({ ...formData, owner_id: value === "none" ? '' : value })}
                >
                  <SelectTrigger><SelectValue placeholder="Seleccionar el cliente" /></SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    <SelectItem value="none">Sin propietario</SelectItem>
                    {clients?.map(client => (
                      <SelectItem key={client.id} value={client.id.toString()}>{client.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <hr className="my-8 border-gray-200 dark:border-gray-700" />
          
          {/* ============================================================================================================== */}
          {/* ## 3. Especificaciones y Consumo ⛽ */}
          {/* ============================================================================================================== */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2 mb-4 text-gray-700 dark:text-gray-200">
              Datos Técnicos y Consumo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Kilometraje */}
              <div className="space-y-2">
                <Label htmlFor="mileage">Kilometraje (km)</Label>
                <Input
                  id="mileage"
                  type="number"
                  step="1"
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
                  <SelectTrigger><SelectValue placeholder="Tipo de combustible" /></SelectTrigger>
                  <SelectContent>
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
                  <SelectTrigger><SelectValue placeholder="Seleccione la transmisión" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatica">Automática</SelectItem>
                    <SelectItem value="semiautomatica">Semiautomática</SelectItem>
                    <SelectItem value="cvt">CVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Capacidad Pasajeros */}
              <div className="space-y-2">
                <Label htmlFor="passenger_capacity">Capacidad Pasajeros</Label>
                <Input
                  id="passenger_capacity"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.passenger_capacity}
                  onChange={(e) => setFormData({ ...formData, passenger_capacity: parseInt(e.target.value) || '' })}
                />
              </div>

              {/* Capacidad Tanque */}
              <div className="space-y-2">
                <Label htmlFor="tank_capacity_liters">Capacidad Tanque (L)</Label>
                <Input
                  id="tank_capacity_liters"
                  type="number"
                  step="0.1"
                  value={formData.tank_capacity_liters}
                  onChange={(e) => setFormData({ ...formData, tank_capacity_liters: e.target.value })}
                />
              </div>

              {/* Eficiencia de Combustible */}
              <div className="space-y-2">
                <Label htmlFor="fuel_efficiency_kml">Eficiencia (km/L)</Label>
                <Input
                  id="fuel_efficiency_kml"
                  type="number"
                  step="0.1"
                  value={formData.fuel_efficiency_kml}
                  onChange={(e) => setFormData({ ...formData, fuel_efficiency_kml: e.target.value })}
                />
              </div>

              {/* Costo por Km */}
              <div className="space-y-2">
                <Label htmlFor="cost_per_km">Costo por Km ($)</Label>
                <Input
                  id="cost_per_km"
                  type="number"
                  step="0.001"
                  value={formData.cost_per_km}
                  onChange={(e) => setFormData({ ...formData, cost_per_km: e.target.value })}
                />
              </div>
              
              {/* Color Calcomanía Verificación */}
              <div className="space-y-2">
                <Label htmlFor="verification_sticker_color">Color Calcomanía Verificación</Label>
                <Input
                  id="verification_sticker_color"
                  value={formData.verification_sticker_color}
                  onChange={(e) => setFormData({ ...formData, verification_sticker_color: e.target.value })}
                />
              </div>

            </div>
          </div>

          <hr className="my-8 border-gray-200 dark:border-gray-700" />
          
          {/* ============================================================================================================== */}
          {/* ## 4. Documentación y Archivos 📄 */}
          {/* ============================================================================================================== */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2 mb-4 text-gray-700 dark:text-gray-200">
              Documentación y Archivos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Tarjeta de Circulación */}
              <div className="space-y-2">
                <Label>Tarjeta de Circulación</Label>
                <Input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleFileUpload('registration_card_url', e)} />
                {formData.registration_card_url && (
                  <a href={formData.registration_card_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm block truncate">
                    Ver documento subido
                  </a>
                )}
              </div>

              {/* Póliza de Seguro */}
              <div className="space-y-2">
                <Label>Póliza de Seguro</Label>
                <Input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleFileUpload('insurance_policy_url', e)} />
                {formData.insurance_policy_url && (
                  <a href={formData.insurance_policy_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm block truncate">
                    Ver póliza subida
                  </a>
                )}
              </div>

              {/* Fecha Expiración Póliza */}
              <div className="space-y-2">
                <Label htmlFor="policy_expiration_date">Fecha Expiración Póliza</Label>
                <Input
                  id="policy_expiration_date"
                  type="date"
                  value={formData.policy_expiration_date}
                  onChange={(e) => setFormData({ ...formData, policy_expiration_date: e.target.value })}
                />
              </div>

              {/* Factura */}
              <div className="space-y-2">
                <Label>Factura</Label>
                <Input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleFileUpload('invoice_url', e)} />
                {formData.invoice_url && (
                  <a href={formData.invoice_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm block truncate">
                    Ver factura subida
                  </a>
                )}
              </div>

              {/* Certificado Verificación */}
              <div className="space-y-2">
                <Label>Certificado Verificación</Label>
                <Input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleFileUpload('verification_certificate_url', e)} />
                {formData.verification_certificate_url && (
                  <a href={formData.verification_certificate_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm block truncate">
                    Ver certificado subido
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          {/* ============================================================================================================== */}
          {/* ## 5. Imágenes y Notas 🖼️ */}
          {/* ============================================================================================================== */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2 mb-4 text-gray-700 dark:text-gray-200">
              Imágenes y Notas Adicionales
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Imagen Principal */}
              <div className="space-y-2 lg:col-span-1">
                <Label htmlFor="image" className="font-medium">Imagen Principal del Vehículo</Label>
                <div className="flex flex-col gap-2">
                  <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  {uploading && <Loader2 className="w-6 h-6 animate-spin text-blue-500" />}
                </div>
                {formData.image_url && (
                  <div className="mt-4 p-2 border rounded-lg flex flex-col items-center bg-gray-50 dark:bg-gray-800">
                    <img src={formData.image_url} alt="Preview" className="h-40 w-full object-contain rounded-lg shadow-md" />
                    <Button type="button" variant="destructive" size="sm" className="mt-2 w-full" onClick={() => setFormData({ ...formData, image_url: '' })}>
                      Eliminar Imagen
                    </Button>
                  </div>
                )}
              </div>

              {/* Notas (A la derecha de la imagen principal) */}
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="notes">Notas / Descripción Adicional</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  rows={8} // Aumentar filas para mejor uso del espacio
                  className="min-h-[150px]"
                />
              </div>
            </div>

            {/* Imágenes Detalladas (Sección completa debajo) */}
            <div className="space-y-2 pt-4">
              <Label className="font-medium">Imágenes Detalladas (Múltiples vistas)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleDetailedImageUpload}
                disabled={uploadingDetailedImages}
                multiple
              />
              {uploadingDetailedImages && <Loader2 className="w-6 h-6 animate-spin text-blue-500" />}
              {detailedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {detailedImages.map((url, idx) => (
                    <div key={idx} className="relative group overflow-hidden rounded-lg shadow-md">
                      <img src={url} alt={`Detallada ${idx + 1}`} className="h-24 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 w-6 h-6 rounded-full p-0 opacity-80 hover:opacity-100 transition-opacity"
                        onClick={() => removeDetailedImage(url)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="px-6">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving} className="px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {vehicle ? 'Actualizar Vehículo' : 'Crear Vehículo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}