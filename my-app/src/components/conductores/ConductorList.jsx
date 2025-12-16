import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, Mail, Phone, MapPin, User, HeartPulse, Calendar } from "lucide-react";

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%2394a3b8'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23fff' font-size='40' font-family='Arial'%3E👤%3C/text%3E%3C/svg%3E";

// Función para construir la URL de la imagen correctamente
const buildImageUrl = (foto) => {
  // Si no hay foto, usar fallback
  if (!foto) {
    return FALLBACK_IMAGE;
  }

  // Si ya es una URL completa (http o https)
  if (foto.startsWith('http://') || foto.startsWith('https://')) {
    return foto;
  }

  // Si empieza con /uploads, /images, /pdfs
  if (foto.startsWith('/uploads') || foto.startsWith('/images') || foto.startsWith('/pdfs')) {
    const url = `${import.meta.env.VITE_DOC_URL}${foto}`;
    return url;
  }

  // Si solo dice "uploads/..." sin /
  if (foto.startsWith('uploads/') || foto.startsWith('images/') || foto.startsWith('pdfs/')) {
    const url = `${import.meta.env.VITE_DOC_URL}/${foto}`;
    return url;
  }

  // Si es una ruta local de Windows (C:\, D:\), ignorar
  if (/^[A-Z]:\\/i.test(foto)) {
    return FALLBACK_IMAGE;
  }

  // Por defecto, asumir que es una ruta relativa
  const url = `${import.meta.env.VITE_DOC_URL}/${foto}`;
  return url;
};

// Función utilitaria para mapear el estatus numérico a texto y estilo
const getEstatusInfo = (estatus) => {
  switch (estatus) {
    case 0:
      return { text: 'Activo', className: 'bg-green-100 text-green-700 hover:bg-green-200 border-green-300' };
    case 1:
      return { text: 'Inactivo', className: 'bg-red-100 text-red-700 hover:bg-red-200 border-red-300' };
    case 2:
      return { text: 'Suspendido', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300' };
    default:
      return { text: 'Desconocido', className: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300' };
  }
};

export default function ConductorList({ conductores, isLoading, onEdit, onDelete }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!conductores || conductores.length === 0) {
    return (
      <div className="text-center py-16">
        <User className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <p className="text-slate-500 text-lg">No se encontraron conductores registrados</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {conductores.map((conductor) => {
        const fullName = `${conductor.nombre} ${conductor.apellidoPaterno} ${conductor.apellidoMaterno || ''}`.trim();
        const estatusInfo = getEstatusInfo(conductor.estatus);
        const vencimientoLicencia = conductor.fechaVencimientoLicencia
          ? new Date(conductor.fechaVencimientoLicencia).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
          : 'N/A';

        const direccionCompleta = [
          conductor.calle,
          conductor.numero,
          conductor.colonia,
          conductor.municipio
        ].filter(Boolean).join(', ');

        const fotoUrl = buildImageUrl(conductor.foto);

        return (
          <Card
            key={conductor.id}
            className="border-slate-200 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm group"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                {/* Foto del conductor */}
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-slate-200">
                  <img
                    src={fotoUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('❌ Error cargando imagen:', fotoUrl);
                      console.error('❌ Foto original era:', conductor.foto);
                      e.target.src = FALLBACK_IMAGE;
                    }}
                    onLoad={() => {
                    }}
                  />
                </div>

                {/* Información del conductor */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">{fullName}</h3>
                  <Badge variant="outline" className={`mt-1 capitalize ${estatusInfo.className}`}>
                    {estatusInfo.text}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {/* Celular */}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4" />
                  <span>{conductor.celular}</span>
                </div>

                {/* Correo */}
                {conductor.correo && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{conductor.correo}</span>
                  </div>
                )}

                {/* Dirección */}
                {direccionCompleta && (
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{direccionCompleta}</span>
                  </div>
                )}

                {/* Licencia */}
                {conductor.numeroLicencia && (
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">Licencia:</span> {conductor.numeroLicencia}
                  </div>
                )}

                {/* Vencimiento Licencia */}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Vence:</span> {vencimientoLicencia}
                </div>

                {/* Tipo de Sangre y Alergias */}
                {(conductor.tipoSangre || conductor.alergias) && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <HeartPulse className="w-4 h-4" />
                    <span className="font-medium">Salud:</span>
                    {conductor.tipoSangre && `Tipo ${conductor.tipoSangre}`}
                    {conductor.tipoSangre && conductor.alergias && ` / `}
                    {conductor.alergias && `Alergias: ${conductor.alergias}`}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-200">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  onClick={() => onEdit(conductor)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  onClick={() => onDelete(conductor.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}