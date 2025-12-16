// src/api/base44Client.js
const API_URL = import.meta.env.VITE_API_URL;

const apiRequest = async (url, options = {}) => {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    signal: options.signal,
  });

  if (!res.ok) {
    let errorMsg = `Error ${res.status}`;
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || errorMsg;
    } catch (e) {
      const text = await res.text();
      errorMsg = `Error ${res.status}: ${text || 'Respuesta de error no JSON'}`;
    }
    throw new Error(errorMsg);
  }

  if (res.status === 204) {
    return {};
  }

  return res.json();
};

export const base44 = {
  entities: {
    Vehicle: {
      list: async (signal) => apiRequest(`${API_URL}/vehicles`, { signal }),
      create: async (vehicleData, signal) => apiRequest(`${API_URL}/vehicles`, {
        method: "POST",
        body: JSON.stringify(vehicleData),
        signal,
      }),
      update: async (id, vehicleData, signal) => apiRequest(`${API_URL}/vehicles/${id}`, {
        method: "PUT",
        body: JSON.stringify(vehicleData),
        signal,
      }),
      delete: async (id, signal) => apiRequest(`${API_URL}/vehicles/${id}`, {
        method: "DELETE",
        signal,
      }),
      getColorOptions: async (signal) => apiRequest(`${API_URL}/vehicles/colors`, { signal }),
      uploadImage: async (file, signal) => {
        const formData = new FormData();
        formData.append("Files", file);

        const res = await fetch(`${API_URL}/vehicles/upload-images`, {
          method: "POST",
          body: formData,
          signal,
        });

        if (!res.ok) throw new Error("Error al subir la imagen");
        return res.json();
      },
    },
    Brand: {
      list: async (signal) => apiRequest(`${API_URL}/vehicles/brands`, { signal }),
      getModels: async (brandId, signal) => apiRequest(`${API_URL}/vehicles/brands/${brandId}/models`, { signal })
    },

    Maintenance: {
      list: async (signal) => apiRequest(`${API_URL}/maintenances`, { signal }),
      create: async (maintenanceData, signal) => apiRequest(`${API_URL}/maintenances`, {
        method: "POST",
        body: JSON.stringify(maintenanceData),
        signal,
      }),
      update: async (id, maintenanceData, signal) => apiRequest(`${API_URL}/maintenances/${id}`, {
        method: "PUT",
        body: JSON.stringify(maintenanceData),
        signal,
      }),
      delete: async (id, signal) => apiRequest(`${API_URL}/maintenances/${id}`, {
        method: "DELETE",
        signal,
      }),
    },
    Conductores: {
      list: async (signal) => apiRequest(`${API_URL}/conductores`, { signal }),

      create: async (data, signal) => apiRequest(`${API_URL}/conductores`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        signal,
      }),

      update: async (id, data, signal) => apiRequest(`${API_URL}/conductores/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        signal,
      }),

      delete: async (id, signal) => apiRequest(`${API_URL}/conductores/${id}`, {
        method: "DELETE",
        signal,
      }),
    },

    SistemaEntrega: {
      crearInspeccion: async (informacionDto, signal) =>
        apiRequest(`${API_URL}/SistemaEntrega`, {
          method: "POST",
          body: JSON.stringify(informacionDto),
          signal,
        }),

      obtenerInspeccion: async (id, signal) =>
        apiRequest(`${API_URL}/SistemaEntrega/${id}`, { signal }),

      listar: async (signal) => apiRequest(`${API_URL}/SistemaEntrega`, { signal }),

      actualizarPaso: async (id, numeroPaso, datosPaso, signal) =>
        apiRequest(`${API_URL}/SistemaEntrega/${id}/paso/${numeroPaso}`, {
          method: "PUT",
          body: JSON.stringify(datosPaso),
          signal,
        }),

      actualizarExterior: async (id, dto, signal) =>
        apiRequest(`${API_URL}/SistemaEntrega/${id}/exterior`, {
          method: "PUT",
          body: JSON.stringify(dto),
          signal,
        }),

      actualizarLlantas: async (id, dto, signal) =>
        apiRequest(`${API_URL}/SistemaEntrega/${id}/llantas`, {
          method: "PUT",
          body: JSON.stringify(dto),
          signal,
        }),

      actualizarFluidosInterior: async (id, dto, signal) =>
        apiRequest(`${API_URL}/SistemaEntrega/${id}/fluidos-interior`, {
          method: "PUT",
          body: JSON.stringify(dto),
          signal,
        }),

      actualizarEquipo: async (id, dto, signal) =>
        apiRequest(`${API_URL}/SistemaEntrega/${id}/equipo`, {
          method: "PUT",
          body: JSON.stringify(dto),
          signal,
        }),

      actualizarEntrega: async (id, dto, signal) =>
        apiRequest(`${API_URL}/SistemaEntrega/${id}/entrega`, {
          method: "PUT",
          body: JSON.stringify(dto),
          signal,
        }),

      finalizar: async (id, signal) =>
        apiRequest(`${API_URL}/SistemaEntrega/${id}/finalizar`, {
          method: "POST",
          signal,
        }),

      eliminar: async (id, signal) =>
        apiRequest(`${API_URL}/SistemaEntrega/${id}`, {
          method: "DELETE",
          signal,
        }),
      visualizarPDF: (id) => {
        const url = `${API_URL}/SistemaEntrega/${id}/pdf`;
        window.open(url, '_blank');
      },

      obtenerProgreso: async (id, signal) =>
        apiRequest(`${API_URL}/SistemaEntrega/${id}/progreso`, { signal }),

      obtenerEstados: async (tipo, signal) =>
        apiRequest(`${API_URL}/SistemaEntrega/estados?tipo=${tipo}`, { signal }),

      obtenerPersonal: async (signal) =>
        apiRequest(`${API_URL}/SistemaEntrega/personal`, { signal }),
    },
  },
};