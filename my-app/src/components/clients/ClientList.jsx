import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, Mail, Phone, MapPin, Users, User } from "lucide-react";

export default function ClientList({ clients, isLoading, onEdit, onDelete }) {
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

  if (clients.length === 0) {
    return (
      <div className="text-center py-16">
        <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <p className="text-slate-500 text-lg">No se encontraron clientes</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => (
        <Card key={client.id} className="border-slate-200 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm group">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {client.full_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{client.full_name}</h3>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {client.client_type}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {client.email && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{client.email}</span>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4" />
                  <span>{client.phone}</span>
                </div>
              )}
              {client.city && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{client.city}</span>
                </div>
              )}
              {client.identification && (
                <div className="text-sm text-slate-600">
                  <span className="font-medium">ID:</span> {client.identification}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                onClick={() => onEdit(client)}
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                onClick={() => onDelete(client.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}