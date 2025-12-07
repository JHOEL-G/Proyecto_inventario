import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function ConductorDialog({ open, onOpenChange, conductor, onSave, isSaving }) {

  const initialFormData = {
    // Datos personales
    Nombre: '',
    ApellidoPaterno: '',
    ApellidoMaterno: '',

    // Contacto
    Correo: '',
    Celular: '',
    TelefonoLocal: '',
    TelefonoEmergencia: '',

    // Dirección
    Calle: '',
    Numero: '',
    Colonia: '',
    Municipio: '',
    Estado: '',
    CodigoPostal: '',

    // Documentos y Salud
    TipoSangre: '',
    Alergias: '',
    NumeroSeguroSocial: '',
    Curp: '',
    NumeroLicencia: '',
    FechaVencimientoLicencia: new Date().toISOString().split("T")[0], // fecha inicial válida

    // Archivos
    FotoFile: null,
    ArchivoIneFile: null,
    ArchivoComprobanteDomicilioFile: null,
    ArchivoLicenciaFile: null,
    ArchivoAntecedentesNoPenalesFile: null,

    // Otros
    UnidadAsignadaId: null,
    Estatus: 0,
  };

  const [formData, setFormData] = useState(initialFormData);
  const comboItemClass = "cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-blue-200 transition-colors";

  useEffect(() => {
    if (conductor) {
      setFormData({
        Nombre: conductor.Nombre || '',
        ApellidoPaterno: conductor.ApellidoPaterno || '',
        ApellidoMaterno: conductor.ApellidoMaterno || '',

        Correo: conductor.Correo || '',
        Celular: conductor.Celular || '',
        TelefonoLocal: conductor.TelefonoLocal || '',
        TelefonoEmergencia: conductor.TelefonoEmergencia || '',

        Calle: conductor.Calle || '',
        Numero: conductor.Numero || '',
        Colonia: conductor.Colonia || '',
        Municipio: conductor.Municipio || '',
        Estado: conductor.Estado || '',
        CodigoPostal: conductor.CodigoPostal || '',

        TipoSangre: conductor.TipoSangre || '',
        Alergias: conductor.Alergias || '',
        NumeroSeguroSocial: conductor.NumeroSeguroSocial || '',
        NumeroLicencia: conductor.NumeroLicencia || '',
        FechaVencimientoLicencia: conductor.FechaVencimientoLicencia
          ? conductor.FechaVencimientoLicencia.split("T")[0]
          : new Date().toISOString().split("T")[0],
        Curp: conductor.Curp || '',

        FotoFile: null,
        ArchivoIneFile: null,
        ArchivoComprobanteDomicilioFile: null,
        ArchivoLicenciaFile: null,
        ArchivoAntecedentesNoPenalesFile: null,

        UnidadAsignadaId: conductor.UnidadAsignadaId || null,
        Estatus: conductor.Estatus ?? 0,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [conductor, open]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.Nombre || !formData.ApellidoPaterno || !formData.Celular) {
      alert("Nombre, Apellido Paterno y Celular son obligatorios.");
      return;
    }

    const data = new FormData();

    // Agregar campos de texto
    Object.keys(formData).forEach((key) => {
      if (!key.endsWith("File")) {
        data.append(key, formData[key] ?? "");
      }
    });

    // Agregar archivos
    if (formData.FotoFile) data.append("FotoFile", formData.FotoFile);
    if (formData.ArchivoIneFile) data.append("ArchivoIneFile", formData.ArchivoIneFile);
    if (formData.ArchivoComprobanteDomicilioFile) data.append("ArchivoComprobanteDomicilioFile", formData.ArchivoComprobanteDomicilioFile);
    if (formData.ArchivoLicenciaFile) data.append("ArchivoLicenciaFile", formData.ArchivoLicenciaFile);
    if (formData.ArchivoAntecedentesNoPenalesFile) data.append("ArchivoAntecedentesNoPenalesFile", formData.ArchivoAntecedentesNoPenalesFile);

    if (conductor?.id) data.append("id", conductor.id);

    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-white text-gray-900 rounded-xl shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {conductor ? "Editar Conductor" : "Agregar Conductor"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* DATOS PERSONALES */}
          <h3 className="text-lg font-semibold border-b pb-1 text-blue-600">Datos Personales y Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="Nombre">Nombre *</Label>
              <Input id="Nombre" value={formData.Nombre} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="ApellidoPaterno">Apellido Paterno *</Label>
              <Input id="ApellidoPaterno" value={formData.ApellidoPaterno} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="ApellidoMaterno">Apellido Materno</Label>
              <Input id="ApellidoMaterno" value={formData.ApellidoMaterno} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="Curp">CURP</Label>
              <Input id="Curp" value={formData.Curp} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="Correo">Correo</Label>
              <Input id="Correo" type="email" value={formData.Correo} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="Celular">Celular *</Label>
              <Input id="Celular" value={formData.Celular} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="TelefonoLocal">Teléfono Local</Label>
              <Input id="TelefonoLocal" value={formData.TelefonoLocal} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="TelefonoEmergencia">Teléfono Emergencia</Label>
              <Input id="TelefonoEmergencia" value={formData.TelefonoEmergencia} onChange={handleChange} />
            </div>
          </div>

          {/* DIRECCIÓN */}
          <h3 className="text-lg font-semibold border-b pb-1 text-blue-600">Dirección</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="Calle">Calle</Label>
              <Input id="Calle" value={formData.Calle} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="Numero">Número</Label>
              <Input id="Numero" value={formData.Numero} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="CodigoPostal">Código Postal</Label>
              <Input id="CodigoPostal" value={formData.CodigoPostal} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="Colonia">Colonia</Label>
              <Input id="Colonia" value={formData.Colonia} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="Municipio">Municipio</Label>
              <Input id="Municipio" value={formData.Municipio} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="Estado">Estado</Label>
              <Input id="Estado" value={formData.Estado} onChange={handleChange} />
            </div>
          </div>

          {/* SALUD Y DOCUMENTOS */}
          <h3 className="text-lg font-semibold border-b pb-1 text-blue-600">Salud y Documentación</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="TipoSangre">Tipo de Sangre</Label>
              <Input id="TipoSangre" value={formData.TipoSangre} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="Alergias">Alergias</Label>
              <Input id="Alergias" value={formData.Alergias} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="NumeroSeguroSocial">No. Seguro Social</Label>
              <Input id="NumeroSeguroSocial" value={formData.NumeroSeguroSocial} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="NumeroLicencia">No. Licencia</Label>
              <Input id="NumeroLicencia" value={formData.NumeroLicencia} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="FechaVencimientoLicencia">Vencimiento</Label>
              <Input type="date" id="FechaVencimientoLicencia" value={formData.FechaVencimientoLicencia} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="Estatus">Estatus</Label>
              <Select value={String(formData.Estatus)} onValueChange={(value) => handleSelectChange("Estatus", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0" className={comboItemClass}>Activo</SelectItem>
                  <SelectItem value="1" className={comboItemClass}>Inactivo</SelectItem>
                  <SelectItem value="2" className={comboItemClass}>Suspendido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ARCHIVOS */}
          <h3 className="text-lg font-semibold border-b pb-1 text-blue-600">Documentos / Imágenes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="FotoFile">Foto</Label>
              <Input type="file" id="FotoFile" accept="image/*" onChange={handleFileChange} />
            </div>
            <div>
              <Label htmlFor="ArchivoIneFile">INE</Label>
              <Input type="file" id="ArchivoIneFile" onChange={handleFileChange} />
            </div>
            <div>
              <Label htmlFor="ArchivoComprobanteDomicilioFile">Comprobante Domicilio</Label>
              <Input type="file" id="ArchivoComprobanteDomicilioFile" onChange={handleFileChange} />
            </div>
            <div>
              <Label htmlFor="ArchivoLicenciaFile">Licencia</Label>
              <Input type="file" id="ArchivoLicenciaFile" onChange={handleFileChange} />
            </div>
            <div>
              <Label htmlFor="ArchivoAntecedentesNoPenalesFile">Antecedentes No Penales</Label>
              <Input type="file" id="ArchivoAntecedentesNoPenalesFile" onChange={handleFileChange} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-blue-600 to-blue-700">
              {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {conductor ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
