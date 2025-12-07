import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import ConductorDialog from "../components/conductores/ConductorDialog";
import ConductorList from "../components/conductores/ConductorList";


export default function Conductores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConductor, setSelectedConductor] = useState(null); // Renombrado
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  // 1. Carga de datos: Usar la entidad Conductores
  const { data: conductores = [], isLoading } = useQuery({
    queryKey: ['conductores'], // Renombrado
    queryFn: () => base44.entities.Conductores.list(), // Usar base44.entities.Conductores
  });

  // 2. Mutación de Creación: Usar la entidad Conductores
  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Conductores.create(data), // Usar base44.entities.Conductores
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conductores'] }); // Renombrado
      setIsDialogOpen(false);
      setSelectedConductor(null);
    },
  });

  // 3. Mutación de Actualización: Usar la entidad Conductores
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Conductores.update(id, data), // Usar base44.entities.Conductores
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conductores'] }); // Renombrado
      setIsDialogOpen(false);
      setSelectedConductor(null);
    },
  });

  // 4. Mutación de Eliminación: Usar la entidad Conductores
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Conductores.delete(id), // Usar base44.entities.Conductores
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conductores'] }); // Renombrado
    },
  });

  const handleSave = (data) => {
    if (selectedConductor) {
      updateMutation.mutate({ id: selectedConductor.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (conductor) => { // Renombrado
    setSelectedConductor(conductor); // Renombrado
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este conductor?')) { // Texto actualizado
      deleteMutation.mutate(id);
    }
  };

  // 5. Lógica de Filtrado: Usar los campos del modelo Conductor
  const filteredConductores = conductores.filter(conductor => {
    const search = searchTerm.toLowerCase();
    
    const fullName = `${conductor.nombre || ''} ${conductor.apellidoPaterno || ''} ${conductor.apellidoMaterno || ''}`;

    return (
        fullName.toLowerCase().includes(search) ||
        conductor.correo?.toLowerCase().includes(search) ||
        conductor.celular?.includes(search) ||
        conductor.curp?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          {/* Texto actualizado */}
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Gestión de Conductores
          </h1>
          {/* Texto actualizado */}
          <p className="text-slate-600 mt-1">{conductores.length} conductores registrados</p>
        </div>
        <Button 
          onClick={() => {
            setSelectedConductor(null); // Renombrado
            setIsDialogOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Conductor {/* Texto actualizado */}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <Input
          placeholder="Buscar por nombre, celular o CURP..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/80 backdrop-blur-sm border-slate-200"
        />
      </div>

      {/* Uso del componente de lista corregido */}
      <ConductorList
        conductores={filteredConductores} // Renombrado
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Uso del componente de diálogo corregido */}
      <ConductorDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        conductor={selectedConductor} // Renombrado
        onSave={handleSave}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}