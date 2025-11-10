// src/api/base44Client.js
const API_URL = import.meta.env.VITE_API_URL || "https://inventario-vehiculos.onrender.com/api";

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
      uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("File", file);

    const res = await fetch(`${API_URL}/vehicles/upload-image`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Error al subir la imagen");
    return res.json(); // backend devuelve { imageUrl: "..." }
  },
    },
    Brand: {
      list: async () => apiRequest(`${API_URL}/vehicles/brands`),
      getModels: async (brandId) => apiRequest(`${API_URL}/vehicles/brands/${brandId}/models`)
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
      create: async (clientData) => apiRequest(`${API_URL}/clients`, {
        method: "POST",
        body: JSON.stringify(clientData),
      }),
      update: async (id, clientData) => apiRequest(`${API_URL}/clients/${id}`, {
        method: "PUT",
        body: JSON.stringify(clientData),
      }),
      delete: async (id) => apiRequest(`${API_URL}/clients/${id}`, {
        method: "DELETE",
      }),
    },
  },
};