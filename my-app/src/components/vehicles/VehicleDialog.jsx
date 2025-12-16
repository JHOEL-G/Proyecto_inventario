import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DialogDescription } from '../ui/dialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { Loader2, Trash2, Upload, Check, X, FileText, Calendar, Gauge, Fuel, Settings, DollarSign, MapPin, Image as ImageIcon } from "lucide-react";

const initialFormData = {
  marcaId: '',
  modeloId: '',
  year: new Date().getFullYear(),
  serial_number: '',
  license_plate: '',
  colorId: '',
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
};

const transformFromBackend = (backendData) => {
  if (!backendData) return null;

  const statusMap = {
    'Active': 'disponible',
    'Sold': 'vendido',
    'Maintenance': 'en_mantenimiento',
    'Inactive': 'reservado'
  };

  const fuelTypeMap = {
    'Gasoline': 'gasolina',
    'Diesel': 'diesel',
    'Electric': 'electrico',
    'Hybrid': 'hibrido'
  };

  const transmissionMap = {
    'Manual': 'manual',
    'Automatic': 'automatica',
    'CVT': 'cvt'
  };

  const detailedImagesUrls = backendData.detailedImages?.map(img => img.url) || [];

  return {
    id: backendData.id,
    marcaId: backendData.marcaID?.toString() || '',
    modeloId: backendData.modeloID?.toString() || '',
    year: backendData.year || new Date().getFullYear(),
    serial_number: backendData.serialNumber || '',
    license_plate: backendData.licensePlate || '',
    colorId: backendData.colorId?.toString() || '',
    status: statusMap[backendData.status] || 'disponible',
    location: backendData.location || '',
    purchase_price: backendData.purchasePrice?.toString() || '',
    sale_price: backendData.salePrice?.toString() || '',
    mileage: backendData.mileage?.toString() || '',
    fuel_type: fuelTypeMap[backendData.fuelType] || 'gasolina',
    transmission: transmissionMap[backendData.transmission] || 'manual',
    image_url: backendData.primaryImage?.url || '',
    notes: backendData.notes || '',
    owner_id: backendData.ownerId?.toString() || '',
    engine_number: backendData.engineNumber || '',
    registration_number: backendData.registrationNumber || '',
    registration_card_url: backendData.registrationCardUrl || '',
    insurance_policy_url: backendData.insurancePolicyUrl || '',
    policy_expiration_date: backendData.policyExpirationDate
      ? backendData.policyExpirationDate.split('T')[0]
      : '',
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
  const statusMap = {
    'disponible': 'Active',
    'vendido': 'Sold',
    'en_mantenimiento': 'Maintenance',
    'reservado': 'Inactive'
  };

  const fuelTypeMap = {
    'gasolina': 'Gasoline',
    'diesel': 'Diesel',
    'electrico': 'Electric',
    'hibrido': 'Hybrid',
    'gas': 'Gasoline'
  };

  const transmissionMap = {
    'manual': 'Manual',
    'automatica': 'Automatic',
    'cvt': 'CVT',
    'semiautomatica': 'Automatic'
  };

  const detailedImages = Array.isArray(frontendData.detailed_images)
    ? frontendData.detailed_images.map((url, index) => ({
      id: 0,
      url: url,
      description: `Imagen ${index + 1}`,
      isPrimary: index === 0
    }))
    : [];

  return {
    id: frontendData.id || 0,
    marcaID: parseInt(frontendData.marcaId) || 0,
    modeloID: parseInt(frontendData.modeloId) || 0,
    year: parseInt(frontendData.year) || new Date().getFullYear(),
    serialNumber: frontendData.serial_number || '',
    licensePlate: frontendData.license_plate || null,
    colorId: frontendData.colorId || null,
    status: statusMap[frontendData.status] ?? 'Active',
    location: frontendData.location || null,
    purchasePrice: frontendData.purchase_price ? parseFloat(frontendData.purchase_price) : 0,
    salePrice: frontendData.sale_price ? parseFloat(frontendData.sale_price) : 0,
    mileage: frontendData.mileage ? parseFloat(frontendData.mileage) : 0,
    fuelType: fuelTypeMap[frontendData.fuel_type] ?? 'Gasoline',
    transmission: transmissionMap[frontendData.transmission] ?? 'Manual',
    notes: frontendData.notes || null,
    ownerId: frontendData.owner_id ? parseInt(frontendData.owner_id) : null,
    engineNumber: frontendData.engine_number || null,
    registrationNumber: frontendData.registration_number || null,
    registrationCardUrl: frontendData.registration_card_url || null,
    insurancePolicyUrl: frontendData.insurance_policy_url || null,
    policyExpirationDate: frontendData.policy_expiration_date
      ? new Date(frontendData.policy_expiration_date).toISOString()
      : null,
    invoiceUrl: frontendData.invoice_url || null,
    verificationCertificateUrl: frontendData.verification_certificate_url || null,
    verificationStickerColor: frontendData.verification_sticker_color || null,
    passengerCapacity: parseInt(frontendData.passenger_capacity) || 0,
    tankCapacityLiters: frontendData.tank_capacity_liters
      ? parseFloat(frontendData.tank_capacity_liters)
      : 0,
    costPerKm: frontendData.cost_per_km
      ? parseFloat(frontendData.cost_per_km)
      : 0,
    fuelEfficiencyKmL: frontendData.fuel_efficiency_kml
      ? parseFloat(frontendData.fuel_efficiency_kml)
      : 0,
    detailedImages: detailedImages
  };
};

export default function VehicleDialog({ open, onOpenChange, vehicle, onSave, isSaving, clients, brands, models, colors }) {
  const [modelOptions, setModelOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingDetailedImages, setUploadingDetailedImages] = useState(false);
  const [detailedImages, setDetailedImages] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const mappedColors = colors.map(c => ({
      id: c.colorId.toString(),
      name: c.nombreColor
    }));
    if (open) {
      if (vehicle) {
        const transformedData = transformFromBackend(vehicle);
        const filteredModels = models.filter(
          (m) => m && m.marcaId?.toString() === transformedData.marcaId?.toString()
        );
        setModelOptions(filteredModels);
        setFormData(transformedData);
        setDetailedImages(transformedData.detailed_images || []);
      } else {
        setFormData(initialFormData);
        setDetailedImages([]);
        setModelOptions([]);
      }
      setColorOptions(mappedColors);
    }
  }, [vehicle, open, models, colors]);

  useEffect(() => {
    if (!formData.marcaId) {
      setModelOptions([]);
      setColorOptions([]);
      return;
    }

    const fetchModels = async () => {
      try {
        const modelsFromApi = await base44.entities.Brand.getModels(formData.marcaId);
        const mappedModels = modelsFromApi.map(m => ({
          id: m.modeloId,
          name: m.modelo
        }));
        setModelOptions(mappedModels);
        const modelExists = mappedModels.some(m => m?.id?.toString() === formData.modeloId?.toString());
        if (!modelExists && formData.modeloId) {
          setFormData(prev => ({ ...prev, modeloId: '' }));
        }
      } catch (err) {
        console.error('Error fetching models:', err);
        setModelOptions([]);
        setColorOptions([]);
        setFormData(prev => ({ ...prev, modeloId: '' }));
      }
    };

    fetchModels();
  }, [formData.marcaId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const backendData = transformToBackend(formData);
    onSave(backendData);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSelectChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  // Este es un ejemplo conceptual. Adapta tu código real.
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const response = await base44.entities.Vehicle.uploadImage(file);

      const urlFromBackend = response.fileUrls && response.fileUrls.length > 0
        ? response.fileUrls[0]
        : null;

      if (!urlFromBackend) {
        throw new Error("El servidor no devolvió una URL válida");
      }

      // 🔧 CONSTRUCCIÓN CORRECTA DE LA URL
      let finalUrl;

      // Si la URL ya es completa (empieza con http)
      if (urlFromBackend.startsWith('http')) {
        finalUrl = urlFromBackend;
      }
      // Si es ruta relativa, construir URL completa
      else {
        const baseUrl = import.meta.env.VITE_DOC_URL;
        finalUrl = `${baseUrl}${urlFromBackend.startsWith('/') ? '' : '/'}${urlFromBackend}`;
      }

      // ⚠️ CACHE BUSTER solo si es necesario (recomiendo quitarlo)
      // finalUrl = `${finalUrl}?t=${Date.now()}`;

      setFormData(prevData => ({
        ...prevData,
        image_url: finalUrl,
      }));

    } catch (error) {
      console.error("❌ Error al subir imagen:", error);
      alert("Error al subir la imagen. Verifica la consola.");
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  const handleDetailedImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDetailedImages(true);
    try {
      const resp = await base44.entities.Vehicle.uploadImage(file);
      const { fileUrls } = resp;

      if (fileUrls && fileUrls.length > 0) {
        const partialUrl = fileUrls[0];
        const fullUrl = `${import.meta.env.VITE_DOC_URL}${partialUrl}`;

        setDetailedImages(prev => [...prev, fullUrl]);
        setFormData(prev => ({
          ...prev,
          detailed_images: [...prev.detailed_images, fullUrl]
        }));
      } else {
        console.error("La API de subida no devolvió URLs válidas.", resp);
      }
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

    try {
      const resp = await base44.entities.Vehicle.uploadImage(file);
      if (!resp?.fileUrls?.length) {
        console.error(`No se recibieron URLs al subir ${field}`);
        return;
      }
      const uploadedUrl = `${import.meta.env.VITE_DOC_URL}${resp.fileUrls[0]}`;
      setFormData(prev => ({ ...prev, [field]: uploadedUrl }));
    } catch (error) {
      console.error(`Error subiendo ${field}:`, error);
    }
  };

  const SectionHeader = ({ icon: Icon, title, description }) => (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      {description && <p className="text-sm text-gray-500 ml-12">{description}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* CAMBIO CLAVE: Se redujo el ancho máximo.
        Antes: max-w-[95vw] lg:max-w-6xl xl:max-w-7xl
        Ahora: max-w-[95vw] lg:max-w-4xl xl:max-w-5xl 
      */}
      <DialogContent className="max-w-[95vw] lg:max-w-4xl xl:max-w-5xl w-full max-h-[95vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border-0">
        <DialogHeader className="border-b border-gray-100 pb-6 px-8">
          <DialogTitle className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <Settings className="w-7 h-7 text-white" />
            </div>
            {vehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {vehicle ? 'Actualiza la información del vehículo' : 'Completa los datos para registrar un nuevo vehículo'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-10 py-6 px-8">

          {/* INFORMACIÓN BÁSICA - Usando 3 columnas para ancho */}
          <div className="space-y-6">
            <SectionHeader
              icon={FileText}
              title="Información Básica"
              description="Datos principales de identificación del vehículo"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Bloque de campos de formulario... */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Marca *</Label>
                <Select value={formData.marcaId} onValueChange={(v) => handleSelectChange('marcaId', v)} required>
                  <SelectTrigger className="w-full border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                    <SelectValue placeholder="Selecciona marca" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {brands?.filter(b => b && b.id != null).map((b) => (
                      <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Modelo *</Label>
                <Select value={formData.modeloId} onValueChange={(v) => handleSelectChange('modeloId', v)} required disabled={!formData.marcaId || modelOptions.length === 0}>
                  <SelectTrigger className="w-full border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                    <SelectValue placeholder="Selecciona modelo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {modelOptions?.filter(m => m && m.id != null).map(m => (
                      <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year" className="text-sm font-medium text-gray-700">Año *</Label>
                <Input id="year" type="number" min="1900" max={new Date().getFullYear() + 1} value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || '' })} required className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Color *</Label>
                <Select value={formData.colorId} onValueChange={(colorId) => handleSelectChange('colorId', colorId)} required>
                  <SelectTrigger className="w-full border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                    <SelectValue placeholder="Selecciona color" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {colorOptions?.filter(c => c && c.id != null).map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serial_number" className="text-sm font-medium text-gray-700">Número de Serie / VIN *</Label>
                <Input id="serial_number" value={formData.serial_number} onChange={handleInputChange} required className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="engine_number" className="text-sm font-medium text-gray-700">Número de Motor</Label>
                <Input id="engine_number" value={formData.engine_number} onChange={handleInputChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="license_plate" className="text-sm font-medium text-gray-700">Matrícula / Placa</Label>
                <Input id="license_plate" value={formData.license_plate} onChange={handleInputChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration_number" className="text-sm font-medium text-gray-700">Número de Registro</Label>
                <Input id="registration_number" value={formData.registration_number} onChange={handleInputChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* ESTADO Y PRECIOS - Usando 3 columnas para ancho */}
          <div className="space-y-6">
            <SectionHeader
              icon={DollarSign}
              title="Estado y Precios"
              description="Información financiera y de disponibilidad"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="reservado">Reservado</SelectItem>
                    <SelectItem value="vendido">Vendido</SelectItem>
                    <SelectItem value="en_mantenimiento">En Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Ubicación
                </Label>
                <Input id="location" value={formData.location} onChange={handleInputChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase_price" className="text-sm font-medium text-gray-700">Precio de Compra ($)</Label>
                <Input id="purchase_price" type="number" step="0.01" value={formData.purchase_price} onChange={handleInputChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale_price" className="text-sm font-medium text-gray-700">Precio de Venta ($)</Label>
                <Input id="sale_price" type="number" step="0.01" value={formData.sale_price} onChange={handleInputChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* ESPECIFICACIONES TÉCNICAS - Usando 4 columnas para más detalles */}
          <div className="space-y-6">
            <SectionHeader
              icon={Gauge}
              title="Especificaciones Técnicas"
              description="Detalles de rendimiento y capacidades"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              <div className="space-y-2">
                <Label htmlFor="mileage" className="text-sm font-medium text-gray-700">Kilometraje (km)</Label>
                <Input id="mileage" type="number" step="1" value={formData.mileage} onChange={handleInputChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Fuel className="w-3 h-3" /> Combustible
                </Label>
                <Select value={formData.fuel_type} onValueChange={(value) => handleSelectChange('fuel_type', value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="gasolina">Gasolina</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="electrico">Eléctrico</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                    <SelectItem value="gas">Gas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Transmisión</Label>
                <Select value={formData.transmission} onValueChange={(value) => handleSelectChange('transmission', value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatica">Automática</SelectItem>
                    <SelectItem value="semiautomatica">Semiautomática</SelectItem>
                    <SelectItem value="cvt">CVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passenger_capacity" className="text-sm font-medium text-gray-700">Capacidad Pasajeros</Label>
                <Input id="passenger_capacity" type="number" min="1" step="1" value={formData.passenger_capacity} onChange={(e) => setFormData({ ...formData, passenger_capacity: parseInt(e.target.value) || '' })} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tank_capacity_liters" className="text-sm font-medium text-gray-700">Capacidad Tanque (L)</Label>
                <Input id="tank_capacity_liters" type="number" step="0.1" value={formData.tank_capacity_liters} onChange={handleInputChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuel_efficiency_kml" className="text-sm font-medium text-gray-700">Eficiencia (km/L)</Label>
                <Input id="fuel_efficiency_kml" type="number" step="0.1" value={formData.fuel_efficiency_kml} onChange={handleInputChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost_per_km" className="text-sm font-medium text-gray-700">Costo por Km ($)</Label>
                <Input id="cost_per_km" type="number" step="0.001" value={formData.cost_per_km} onChange={handleInputChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="verification_sticker_color" className="text-sm font-medium text-gray-700">Color Calcomanía</Label>
                <Input id="verification_sticker_color" value={formData.verification_sticker_color} onChange={handleInputChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* DOCUMENTACIÓN - Usando 3 columnas para ancho */}
          <div className="space-y-6">
            <SectionHeader
              icon={FileText}
              title="Documentación"
              description="Archivos legales y certificaciones"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Tarjeta de Circulación</Label>
                <div className="relative">
                  <Input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleFileUpload('registration_card_url', e)} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
                </div>
                {formData.registration_card_url && (
                  <a href={formData.registration_card_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mt-1">
                    <Check className="w-4 h-4" /> Documento subido
                  </a>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Póliza de Seguro</Label>
                <Input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleFileUpload('insurance_policy_url', e)} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
                {formData.insurance_policy_url && (
                  <a href={formData.insurance_policy_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mt-1">
                    <Check className="w-4 h-4" /> Póliza subida
                  </a>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="policy_expiration_date" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Fecha Expiración Póliza
                </Label>
                <Input id="policy_expiration_date" type="date" value={formData.policy_expiration_date} onChange={handleInputChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Factura</Label>
                <Input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleFileUpload('invoice_url', e)} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
                {formData.invoice_url && (
                  <a href={formData.invoice_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mt-1">
                    <Check className="w-4 h-4" /> Factura subida
                  </a>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Certificado Verificación</Label>
                <Input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleFileUpload('verification_certificate_url', e)} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
                {formData.verification_certificate_url && (
                  <a href={formData.verification_certificate_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mt-1">
                    <Check className="w-4 h-4" /> Certificado subido
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* IMÁGENES Y NOTAS - Imagen 1/3, Notas 2/3 */}
          <div className="space-y-6">
            <SectionHeader
              icon={ImageIcon}
              title="Imágenes y Notas"
              description="Galería fotográfica y observaciones adicionales"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Imagen Principal (1/3) */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Imagen Principal</Label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-blue-400 transition-colors bg-gray-50/50 h-full">
                  {!formData.image_url && (
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                  )}
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                    ) : formData.image_url ? (
                      <div className="w-full relative z-20">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg shadow-md mb-3"
                          onError={(e) => {
                            console.error("Error cargando imagen:", formData.image_url);
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/400x300/f3f4f6/6b7280?text=Sin+Imagen";
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 relative z-30"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setFormData({ ...formData, image_url: '' });
                          }}
                        >
                          <X className="w-4 h-4 mr-1" /> Eliminar
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 font-medium">Subir imagen</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG hasta 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Notas (2/3) */}
              <div className="space-y-3 lg:col-span-2">
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Notas y Observaciones</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={10}
                  placeholder="Añade cualquier información adicional relevante sobre el vehículo..."
                  className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg resize-none min-h-[300px]"
                />
              </div>
            </div>

            {/* Galería de Imágenes Detalladas */}
            <div className="space-y-3 pt-4">
              <Label className="text-sm font-medium text-gray-700">Galería de Imágenes</Label>
              <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-blue-400 transition-colors bg-gray-50/50">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleDetailedImageUpload}
                  disabled={uploadingDetailedImages}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center justify-center py-3 text-center pointer-events-none">
                  {uploadingDetailedImages ? (
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-400 mb-1" />
                      <p className="text-sm text-gray-600">Haz clic para añadir más imágenes</p>
                    </>
                  )}
                </div>
              </div>

              {detailedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 mt-4">
                  {detailedImages.map((url, idx) => (
                    <div key={idx} className="relative group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow aspect-square border border-gray-100">
                      {/* 🔹 Enlace en capa inferior (z-0) */}
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 z-0"
                      >
                        <img
                          src={url}
                          alt={`Detalle ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            console.error("Error cargando imagen galería:", url);
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/200x200/f3f4f6/6b7280?text=Error";
                          }}
                        />
                      </a>
                      {/* 🔹 Botón en capa superior (z-30) con pointer-events-auto */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeDetailedImage(url);
                        }}
                        className="absolute top-1 right-1 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-30 pointer-events-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-gray-100 flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              type="button"
              className="border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {vehicle ? "Actualizar Vehículo" : "Crear Vehículo"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent >
    </Dialog >
  );
}