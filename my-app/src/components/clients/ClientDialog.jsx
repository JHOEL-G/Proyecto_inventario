import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function ClientDialog({ open, onOpenChange, client, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    identification: '',
    client_type: 'individual',
    notes: ''
  });

  const comboItemClass = "cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-blue-200 transition-colors";

  useEffect(() => {
    if (client) {
      setFormData({
        full_name: client.fullName || client.full_name || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        city: client.city || '',
        identification: client.identification || '',
        client_type: (client.clientType || client.client_type || 'individual').toLowerCase(),
        notes: client.notes || ''
      });
    } else {
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        identification: '',
        client_type: 'individual',
        notes: ''
      });
    }
  }, [client, open]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.full_name.trim() || !formData.phone.trim()) {
      alert('El nombre y teléfono son requeridos');
      return;
    }

    const clientTypeMap = { individual: 1, empresa: 2 };

    const backendData = {
      fullName: formData.full_name.trim(),
      email: formData.email.trim() || null,
      phone: formData.phone.trim(),
      address: formData.address.trim() || null,
      city: formData.city.trim() || null,
      identification: formData.identification.trim() || null,
      clienttype: clientTypeMap[formData.client_type], // t minúscula
      notes: formData.notes.trim() || null
    };

    if (client && client.id) {
      backendData.id = client.id;
    }

    onSave(backendData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-gray-900 rounded-xl shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {client ? 'Editar Cliente' : 'Agregar Cliente'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre completo */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="full_name">Nombre Completo *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                className="bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Identificación */}
            <div className="space-y-2">
              <Label htmlFor="identification">DNI / Identificación</Label>
              <Input
                id="identification"
                value={formData.identification}
                onChange={(e) => setFormData({ ...formData, identification: e.target.value })}
                className="bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tipo de Cliente */}
            <div className="space-y-2">
              <Label htmlFor="client_type">Tipo de Cliente</Label>
              <Select
                value={formData.client_type}
                onValueChange={(value) => setFormData({ ...formData, client_type: value })}
              >
                <SelectTrigger className="bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 rounded-md shadow-md">
                  <SelectItem value="individual" className={comboItemClass}>Individual</SelectItem>
                  <SelectItem value="empresa" className={comboItemClass}>Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dirección */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Ciudad */}
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Notas */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
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
              {client ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
