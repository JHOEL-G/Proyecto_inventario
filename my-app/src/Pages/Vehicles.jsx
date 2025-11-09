import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Plus, Search } from "lucide-react";
import VehicleGrid from "../components/vehicles/VehicleGrid";
import VehicleDialog from "../components/vehicles/VehicleDialog";
import VehicleFilters from "../components/vehicles/VehicleFilters";

export default function Vehicles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({ status: 'all', fuel_type: 'all' });

  const queryClient = useQueryClient();

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => base44.entities.Vehicle.list('-created_date'),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
  });

  const createMutation = useMutation({
    mutationFn: (vehicleData) => base44.entities.Vehicle.create(vehicleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setIsDialogOpen(false);
      setSelectedVehicle(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Vehicle.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setIsDialogOpen(false);
      setSelectedVehicle(null);
    },
  });

  const { data: brandsList = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const { data: modelsList = [] } = useQuery({
  queryKey: ['models'],
  queryFn: () => base44.entities.Brand.getModels(selectedBrandId || 0), // si quieres filtrar por marca
});



  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Vehicle.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const handleSave = (vehicleData) => {
  if (selectedVehicle) {
    const dataWithId = { ...vehicleData, id: selectedVehicle.id };
    updateMutation.mutate({ id: selectedVehicle.id, data: dataWithId });
  } else {
    createMutation.mutate(vehicleData);
  }
};

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este vehículo?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setSelectedVehicle(null);
    setIsDialogOpen(true);
  };
  
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch =
    vehicle.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.modelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
    filters.status === 'all' || vehicle.status.toString() === filters.status;
    const matchesFuel =
    filters.fuel_type === 'all' || vehicle.fuelType.toString() === filters.fuel_type;

    return matchesSearch && matchesStatus && matchesFuel;
});


  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Inventario de Vehículos
          </h1>
          <p className="text-slate-600 mt-1">{vehicles.length} vehículos registrados</p>
        </div>
        <Button 
          onClick={handleAddNew}
          className="bg-gradient-to-r text-gray-50 from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Vehículo
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            placeholder="Buscar por marca, modelo, número de serie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white backdrop-blur-sm border-slate-200"
          />
        </div>
        <VehicleFilters filters={filters} setFilters={setFilters} />
      </div>

      <VehicleGrid
        vehicles={filteredVehicles}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        clients={clients}
      />

      <VehicleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        vehicle={selectedVehicle}
        onSave={handleSave}
        isSaving={createMutation.isPending || updateMutation.isPending}
        clients={clients}
        brands={brandsList}      // <-- esto es nuevo
        models={modelsList}
      />
    </div>
  );
}