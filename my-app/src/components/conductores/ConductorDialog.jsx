import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Loader2,
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  FileText,
  Calendar,
  Check,
  CreditCard,
  Droplet
} from 'lucide-react';


const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-3 border-b pb-3 border-gray-100 mb-4">
    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);


export default function ConductorDialog({ open, onOpenChange, conductor, onSave, isSaving }) {

  const initialFormData = {
    Nombre: '',
    ApellidoPaterno: '',
    ApellidoMaterno: '',
    Correo: '',
    Celular: '',
    TelefonoLocal: '',
    TelefonoEmergencia: '',
    Calle: '',
    Numero: '',
    Colonia: '',
    Municipio: '',
    Estado: '',
    CodigoPostal: '',
    TipoSangre: '',
    Alergias: '',
    NumeroSeguroSocial: '',
    Curp: '',
    NumeroLicencia: '',
    FechaVencimientoLicencia: new Date().toISOString().split("T")[0], // fecha inicial válida

    FotoFile: null,
    ArchivoIneFile: null,
    ArchivoComprobanteDomicilioFile: null,
    ArchivoLicenciaFile: null,
    ArchivoAntecedentesNoPenalesFile: null,

    UnidadAsignadaId: null,
    Estatus: 0,
  };

  const [formData, setFormData] = useState(initialFormData);
  const comboItemClass = "cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-blue-200 transition-colors";

  // Lógica de carga/limpieza de datos (Mantenida)
  useEffect(() => {
    if (conductor) {
      setFormData({
        Nombre: conductor.nombre || '',                    // 🔥 minúscula
        ApellidoPaterno: conductor.apellidoPaterno || '',  // 🔥 camelCase
        ApellidoMaterno: conductor.apellidoMaterno || '',

        Correo: conductor.correo || '',
        Celular: conductor.celular || '',
        TelefonoLocal: conductor.telefonoLocal || '',
        TelefonoEmergencia: conductor.telefonoEmergencia || '',

        Calle: conductor.calle || '',
        Numero: conductor.numero || '',
        Colonia: conductor.colonia || '',
        Municipio: conductor.municipio || '',
        Estado: conductor.estado || '',
        CodigoPostal: conductor.codigoPostal || '',

        TipoSangre: conductor.tipoSangre || '',
        Alergias: conductor.alergias || '',
        NumeroSeguroSocial: conductor.numeroSeguroSocial || '',
        NumeroLicencia: conductor.numeroLicencia || '',
        FechaVencimientoLicencia: conductor.fechaVencimientoLicencia
          ? conductor.fechaVencimientoLicencia.split("T")[0]
          : new Date().toISOString().split("T")[0],
        Curp: conductor.curp || '',

        // Archivos siempre null al editar
        FotoFile: null,
        ArchivoIneFile: null,
        ArchivoComprobanteDomicilioFile: null,
        ArchivoLicenciaFile: null,
        ArchivoAntecedentesNoPenalesFile: null,

        UnidadAsignadaId: conductor.unidadAsignadaId || null,
        Estatus: conductor.estatus ?? 0,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [conductor, open]);

  // Manejadores (Mantenidos)
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSelectChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    const { id, files } = e.target;
    setFormData({ ...formData, [id]: files[0] });
  };

  // Lógica de Submit (Mantenida y crucial para la conversión a Base64)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones mínimas
    if (!formData.Nombre || !formData.ApellidoPaterno || !formData.Celular) {
      alert("Nombre, Apellido Paterno y Celular son obligatorios.");
      return;
    }

    // Función para convertir archivo a Base64
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    // 🔥 CAMBIO: Crear objeto limpio sin los archivos File
    const dataToSend = {
      Nombre: formData.Nombre,
      ApellidoPaterno: formData.ApellidoPaterno,
      ApellidoMaterno: formData.ApellidoMaterno,
      Correo: formData.Correo,
      Celular: formData.Celular,
      TelefonoLocal: formData.TelefonoLocal,
      TelefonoEmergencia: formData.TelefonoEmergencia,
      Calle: formData.Calle,
      Numero: formData.Numero,
      Colonia: formData.Colonia,
      Municipio: formData.Municipio,
      Estado: formData.Estado,
      CodigoPostal: formData.CodigoPostal,
      TipoSangre: formData.TipoSangre,
      Alergias: formData.Alergias,
      NumeroSeguroSocial: formData.NumeroSeguroSocial,
      NumeroLicencia: formData.NumeroLicencia,
      FechaVencimientoLicencia: formData.FechaVencimientoLicencia,
      Curp: formData.Curp,
      UnidadAsignadaId: formData.UnidadAsignadaId,
      Estatus: parseInt(formData.Estatus),
    };

    // 🔥 IMPORTANTE: Convertir archivos a Base64 y agregarlos al objeto
    if (formData.FotoFile) {
      dataToSend.FotoFile = await toBase64(formData.FotoFile);
    }

    if (formData.ArchivoIneFile) {
      dataToSend.ArchivoIneFile = await toBase64(formData.ArchivoIneFile);
    }

    if (formData.ArchivoComprobanteDomicilioFile) {
      dataToSend.ArchivoComprobanteDomicilioFile = await toBase64(formData.ArchivoComprobanteDomicilioFile);
    }

    if (formData.ArchivoLicenciaFile) {
      dataToSend.ArchivoLicenciaFile = await toBase64(formData.ArchivoLicenciaFile);
    }

    if (formData.ArchivoAntecedentesNoPenalesFile) {
      dataToSend.ArchivoAntecedentesNoPenalesFile = await toBase64(formData.ArchivoAntecedentesNoPenalesFile);
    }

    // Si estamos editando, agregar el ID
    if (conductor?.id) {
      dataToSend.Id = conductor.id;
    }

    // Llamar al callback de guardado
    onSave(dataToSend);
  };

  // Contenido del Diálogo (Mantenido)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      {/* Ajuste de estilo y ancho más moderno */}
      <DialogContent className="max-w-[95vw] sm:max-w-3xl lg:max-w-4xl max-h-[95vh] overflow-y-auto bg-white text-gray-900 rounded-2xl shadow-2xl border-0 p-8">
        <DialogHeader className="border-b border-gray-100 pb-6">
          <DialogTitle className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <User className="w-7 h-7 text-white" />
            </div>
            {conductor ? "Editar Conductor" : "Agregar Conductor"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {conductor
              ? "Modifica los datos del conductor y sus documentos."
              : "Ingresa los datos del nuevo conductor en el siguiente formulario."}
          </DialogDescription>
        </DialogHeader>


        <form onSubmit={handleSubmit} className="space-y-8 py-4">

          {/* DATOS PERSONALES */}
          <div>
            <SectionHeader
              icon={User}
              title="Datos Personales y Contacto"
              description="Información básica de identificación y comunicación"
            />
            {/* Se mantiene 3 columnas, buena densidad para un ancho 4xl */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Bloque 1 - Nombres */}
              <div className="space-y-2">
                <Label htmlFor="Nombre" className="text-sm font-medium text-gray-700">Nombre *</Label>
                <Input id="Nombre" value={formData.Nombre} onChange={handleChange} required className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ApellidoPaterno" className="text-sm font-medium text-gray-700">Apellido Paterno *</Label>
                <Input id="ApellidoPaterno" value={formData.ApellidoPaterno} onChange={handleChange} required className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ApellidoMaterno" className="text-sm font-medium text-gray-700">Apellido Materno</Label>
                <Input id="ApellidoMaterno" value={formData.ApellidoMaterno} onChange={handleChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>

              {/* Bloque 2 - Documentos/Contacto */}
              <div className="space-y-2">
                <Label htmlFor="Curp" className="text-sm font-medium text-gray-700">CURP</Label>
                <Input id="Curp" value={formData.Curp} onChange={handleChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Correo" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-gray-500" /> Correo
                </Label>
                <Input id="Correo" type="email" value={formData.Correo} onChange={handleChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Celular" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-gray-500" /> Celular *
                </Label>
                <Input id="Celular" value={formData.Celular} onChange={handleChange} required className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>

              {/* Bloque 3 - Teléfonos adicionales */}
              <div className="space-y-2">
                <Label htmlFor="TelefonoLocal" className="text-sm font-medium text-gray-700">Teléfono Local</Label>
                <Input id="TelefonoLocal" value={formData.TelefonoLocal} onChange={handleChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="TelefonoEmergencia" className="text-sm font-medium text-gray-700">Teléfono Emergencia</Label>
                <Input id="TelefonoEmergencia" value={formData.TelefonoEmergencia} onChange={handleChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* DIRECCIÓN */}
          <div>
            <SectionHeader
              icon={MapPin}
              title="Dirección de Residencia"
              description="Información de la ubicación actual del conductor"
            />
            {/* Se aumenta a 4 columnas para que los campos de dirección sean más anchos y aprovechen el espacio */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="Calle" className="text-sm font-medium text-gray-700">Calle</Label>
                <Input id="Calle" value={formData.Calle} onChange={handleChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Numero" className="text-sm font-medium text-gray-700">Número</Label>
                <Input id="Numero" value={formData.Numero} onChange={handleChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="CodigoPostal" className="text-sm font-medium text-gray-700">Código Postal</Label>
                <Input id="CodigoPostal" value={formData.CodigoPostal} onChange={handleChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="Colonia" className="text-sm font-medium text-gray-700">Colonia</Label>
                <Input id="Colonia" value={formData.Colonia} onChange={handleChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Municipio" className="text-sm font-medium text-gray-700">Municipio</Label>
                <Input id="Municipio" value={formData.Municipio} onChange={handleChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="Estado" className="text-sm font-medium text-gray-700">Estado</Label>
                <Input id="Estado" value={formData.Estado} onChange={handleChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* SALUD Y DOCUMENTOS */}
          <div>
            <SectionHeader
              icon={Heart}
              title="Salud y Documentación Clave"
              description="Datos médicos y de licencia de conducir"
            />
            {/* Se mantiene 4 columnas para detalles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              <div className="space-y-2">
                <Label htmlFor="TipoSangre" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Droplet className="w-3 h-3 text-red-500" /> Tipo de Sangre
                </Label>
                <Input id="TipoSangre" value={formData.TipoSangre} onChange={handleChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="Alergias" className="text-sm font-medium text-gray-700">Alergias</Label>
                <Input id="Alergias" value={formData.Alergias} onChange={handleChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="NumeroSeguroSocial" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-gray-500" /> No. Seguro Social
                </Label>
                <Input id="NumeroSeguroSocial" value={formData.NumeroSeguroSocial} onChange={handleChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="NumeroLicencia" className="text-sm font-medium text-gray-700">No. Licencia</Label>
                <Input id="NumeroLicencia" value={formData.NumeroLicencia} onChange={handleChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="FechaVencimientoLicencia" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gray-500" /> Vencimiento Licencia
                </Label>
                <Input type="date" id="FechaVencimientoLicencia" value={formData.FechaVencimientoLicencia} onChange={handleChange} className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg" />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="Estatus" className="text-sm font-medium text-gray-700">Estatus</Label>
                <Select value={String(formData.Estatus)} onValueChange={(value) => handleSelectChange("Estatus", value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                    <SelectValue placeholder="Seleccione" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="0" className={comboItemClass}>Activo</SelectItem>
                    <SelectItem value="1" className={comboItemClass}>Inactivo</SelectItem>
                    <SelectItem value="2" className={comboItemClass}>Suspendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* ARCHIVOS */}
          <div>
            <SectionHeader
              icon={FileText}
              title="Carga de Documentos"
              description="Archivos de identificación y soporte del conductor"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <div className="space-y-2">
                <Label htmlFor="FotoFile" className="text-sm font-medium text-gray-700">Foto</Label>
                <Input
                  type="file"
                  id="FotoFile"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                />
                {conductor?.foto && !formData.FotoFile && (
                  <div className="mt-2">
                    <img
                      src={`${import.meta.env.VITE_DOC_URL}/${conductor.foto}`}
                      alt="Foto actual"
                      className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">Foto actual (sube otra para reemplazar)</p>
                  </div>
                )}
              </div>

              {/* INE */}
              <div className="space-y-2">
                <Label htmlFor="ArchivoIneFile" className="text-sm font-medium text-gray-700">INE</Label>
                <Input
                  type="file"
                  id="ArchivoIneFile"
                  onChange={handleFileChange}
                  className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                />
                {conductor?.archivoIne && !formData.ArchivoIneFile && (
                  <a
                    href={`${import.meta.env.VITE_DOC_URL}/${conductor.archivoIne}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 mt-1"
                  >
                    <Check className="w-3 h-3" /> Ver INE actual
                  </a>
                )}
              </div>

              {/* Comprobante Domicilio */}
              <div className="space-y-2">
                <Label htmlFor="ArchivoComprobanteDomicilioFile" className="text-sm font-medium text-gray-700">Comprobante Domicilio</Label>
                <Input
                  type="file"
                  id="ArchivoComprobanteDomicilioFile"
                  onChange={handleFileChange}
                  className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                />
                {conductor?.archivoComprobanteDomicilio && !formData.ArchivoComprobanteDomicilioFile && (
                  <a
                    href={`${import.meta.env.VITE_DOC_URL}/${conductor.archivoComprobanteDomicilio}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 mt-1"
                  >
                    <Check className="w-3 h-3" /> Ver comprobante actual
                  </a>
                )}
              </div>

              {/* Licencia */}
              <div className="space-y-2">
                <Label htmlFor="ArchivoLicenciaFile" className="text-sm font-medium text-gray-700">Licencia</Label>
                <Input
                  type="file"
                  id="ArchivoLicenciaFile"
                  onChange={handleFileChange}
                  className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                />
                {conductor?.archivoLicencia && !formData.ArchivoLicenciaFile && (
                  <a
                    href={`${import.meta.env.VITE_DOC_URL}/${conductor.archivoLicencia}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 mt-1"
                  >
                    <Check className="w-3 h-3" /> Ver licencia actual
                  </a>
                )}
              </div>

              {/* Antecedentes No Penales */}
              <div className="space-y-2">
                <Label htmlFor="ArchivoAntecedentesNoPenalesFile" className="text-sm font-medium text-gray-700">Antecedentes No Penales</Label>
                <Input
                  type="file"
                  id="ArchivoAntecedentesNoPenalesFile"
                  onChange={handleFileChange}
                  className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                />
                {conductor?.archivoAntecedentesNoPenales && !formData.ArchivoAntecedentesNoPenalesFile && (
                  <a
                    href={`${import.meta.env.VITE_DOC_URL}/${conductor.archivoAntecedentesNoPenales}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 mt-1"
                  >
                    <Check className="w-3 h-3" /> Ver antecedentes actuales
                  </a>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-gray-100 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
                  {conductor ? "Actualizar Conductor" : "Crear Conductor"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}