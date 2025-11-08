import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import MaintenanceList from "../components/maintenance/MaintenanceList";
import MaintenanceDialog from "../components/maintenance/MaintenanceDialog";
import MaintenanceFilters from "../components/maintenance/MaintenanceFilters";

export default function Maintenance() {
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({ status: 'all', maintenance_type: 'all', priority: 'all' });

  const queryClient = useQueryClient();

  const { data: maintenances = [], isLoading } = useQuery({
    queryKey: ['maintenances'],
    queryFn: () => base44.entities.Maintenance.list('-service_date'),
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => base44.entities.Vehicle.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Maintenance.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      setIsDialogOpen(false);
      setSelectedMaintenance(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Maintenance.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      setIsDialogOpen(false);
      setSelectedMaintenance(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Maintenance.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
    },
  });

  const handleSave = (data) => {
    if (selectedMaintenance) {
      updateMutation.mutate({ id: selectedMaintenance.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este mantenimiento?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredMaintenances = maintenances.filter(m => {
    const matchesStatus = filters.status === 'all' || m.status === filters.status;
    const matchesType = filters.maintenance_type === 'all' || m.maintenance_type === filters.maintenance_type;
    const matchesPriority = filters.priority === 'all' || m.priority === filters.priority;
    return matchesStatus && matchesType && matchesPriority;
  });

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Gestión de Mantenimientos
          </h1>
          <p className="text-slate-600 mt-1">{maintenances.length} registros totales</p>
        </div>
        <Button 
          onClick={() => {
            setSelectedMaintenance(null);
            setIsDialogOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Mantenimiento
        </Button>
      </div>

      <MaintenanceFilters filters={filters} setFilters={setFilters} />

      <MaintenanceList
        maintenances={filteredMaintenances}
        vehicles={vehicles}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <MaintenanceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        maintenance={selectedMaintenance}
        vehicles={vehicles}
        onSave={handleSave}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}