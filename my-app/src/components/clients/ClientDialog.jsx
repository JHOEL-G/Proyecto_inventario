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

  useEffect(() => {
    if (client) {
      // Maneja tanto camelCase (del backend) como snake_case (del estado)
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

  // ENVÍA EL OBJETO PLANO, NO envuelvas en { client: ... }
  onSave(backendData);
};


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {client ? 'Editar Cliente' : 'Agregar Cliente'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="full_name">Nombre Completo *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="identification">DNI / Identificación</Label>
              <Input
                id="identification"
                value={formData.identification}
                onChange={(e) => setFormData({ ...formData, identification: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_type">Tipo de Cliente</Label>
              <Select
                value={formData.client_type}
                onValueChange={(value) => setFormData({ ...formData, client_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="empresa">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-blue-600 to-blue-700">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {client ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
