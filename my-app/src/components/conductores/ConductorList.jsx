import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, Mail, Phone, MapPin, Users, User, HeartPulse, Shield, Calendar } from "lucide-react";

// Función utilitaria para mapear el estatus numérico a texto y estilo
const getEstatusInfo = (estatus) => {
  switch (estatus) {
    case 0: // Activo
      return { text: 'Activo', className: 'bg-green-100 text-green-700 hover:bg-green-200 border-green-300' };
    case 1: // Inactivo
      return { text: 'Inactivo', className: 'bg-red-100 text-red-700 hover:bg-red-200 border-red-300' };
    case 2: // Suspendido
      return { text: 'Suspendido', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300' };
    default:
      return { text: 'Desconocido', className: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300' };
  }
};

// Renombrar 'clients' a 'conductores' para mayor claridad
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
        
        // Construir el nombre completo a partir de los campos del DTO
        const fullName = `${conductor.nombre} ${conductor.apellidoPaterno} ${conductor.apellidoMaterno || ''}`.trim();
        const estatusInfo = getEstatusInfo(conductor.estatus);
        const vencimientoLicencia = conductor.fechaVencimientoLicencia 
          ? new Date(conductor.fechaVencimientoLicencia).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })
          : 'N/A';
        
        const direccionCompleta = [conductor.calle, conductor.numero, conductor.colonia, conductor.municipio].filter(Boolean).join(', ');

        return (
          <Card key={conductor.id} className="border-slate-200 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {conductor.nombre?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{fullName}</h3>
                    {/* Badge de Estatus */}
                    <Badge variant="outline" className={`mt-1 capitalize ${estatusInfo.className}`}>
                      {estatusInfo.text}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {/* Celular (campo requerido) */}
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
                
                {/* Tipo de Sangre y Alergias (Opcional) */}
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
                  onClick={() => onEdit(conductor)} // Usar conductor
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