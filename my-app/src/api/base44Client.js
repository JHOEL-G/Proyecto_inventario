// src/api/base44Client.js
const API_URL = import.meta.env.VITE_API_URL || "https://localhost:7110/api";

const apiRequest = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers, // Permite overrides
    },
  });

  if (!res.ok) {
    let errorMsg = `Error ${res.status}`;
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || errorMsg; // Mensaje del backend (ej: duplicado)
    } catch {} // Si no es JSON, usa genérico
    throw new Error(errorMsg);
  }
  return res.json();
};

export const base44 = {
  entities: {
    Vehicle: {
      list: async () => apiRequest(`${API_URL}/vehicles`),
      create: async (vehicleData) => apiRequest(`${API_URL}/vehicles`, {
        method: "POST",
        body: JSON.stringify(vehicleData),
      }),
      update: async (id, vehicleData) => apiRequest(`${API_URL}/vehicles/${id}`, {
        method: "PUT",
        body: JSON.stringify(vehicleData),
      }),
      delete: async (id) => apiRequest(`${API_URL}/vehicles/${id}`, {
        method: "DELETE",
      }),
    },
    Maintenance: {
      list: async () => apiRequest(`${API_URL}/maintenances`),
      create: async (maintenanceData) => apiRequest(`${API_URL}/maintenances`, {  // <- ¡Nuevo! POST para crear
        method: "POST",
        body: JSON.stringify(maintenanceData),
      }),
      update: async (id, maintenanceData) => apiRequest(`${API_URL}/maintenances/${id}`, {  // <- ¡Nuevo! PUT para editar
        method: "PUT",
        body: JSON.stringify(maintenanceData),
      }),
      delete: async (id) => apiRequest(`${API_URL}/maintenances/${id}`, {  // <- ¡Nuevo! DELETE para borrar
        method: "DELETE",
      }),
    },
    Client: {
      list: async () => apiRequest(`${API_URL}/clients`),
    },
  },
};