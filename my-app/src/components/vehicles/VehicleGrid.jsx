import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, MapPin, Gauge, DollarSign, User } from "lucide-react";

// --- Configuración de URL y Fallback (API Integration) ---
const API_BASE_URL = "https://localhost:7110";
const FALLBACK_IMAGE_URL =
  "https://placehold.co/600x400/CCCCCC/333333?text=Sin+Foto";

// --- START: Componentes de UI Integrados ---
const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const sizeClasses = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-lg",
    icon: "h-10 w-10",
  };
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
    outline: "border border-input bg-white shadow-sm hover:bg-slate-100",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "hover:bg-slate-100",
  };
  const finalClass = `${baseClasses} ${
    sizeClasses[size] || sizeClasses.default
  } ${variantClasses[variant] || variantClasses.default} ${className}`;
  return <button className={finalClass} ref={ref} {...props} />;
});
Button.displayName = "Button";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  />
));
Card.displayName = "Card";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
));
CardContent.displayName = "CardContent";

const Badge = ({ className, variant, ...props }) => {
  const baseClasses =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variantClasses = {
    default: "border-transparent bg-blue-500 text-white hover:bg-blue-500/80",
    secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
    outline: "text-foreground",
  };
  const finalClass = `${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className}`;
  return <div className={finalClass} {...props} />;
};
Badge.displayName = "Badge";

const Skeleton = ({ className, ...props }) => (
  <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} {...props} />
);
// --- END: Componentes de UI Integrados ---

const STATUS_CONFIG = {
  disponible: { color: "bg-green-600 text-white", label: "Disponible para Venta" },
  vendido: { color: "bg-blue-600 text-white", label: "Vendido" },
  en_mantenimiento: { color: "bg-orange-500 text-white", label: "En Mantenimiento" },
  reservado: { color: "bg-purple-600 text-white", label: "Reservado" },
  baja: { color: "bg-red-600 text-white", label: "Dado de Baja" },
  transito: { color: "bg-yellow-500 text-slate-900", label: "En Tránsito" },
};

// Función de utilidad para formatear la moneda
const formatCurrency = (value, locale = "es-PE", currency = "USD") => {
  if (typeof value !== "number" || isNaN(value)) return "N/A";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);
};
const statusMap = {
  0: "disponible",
  1: "vendido",
  2: "en_mantenimiento",
  3: "reservado",
};


export default function VehicleGrid({ vehicles, isLoading, onEdit, onDelete, clients }) {
  // Función para manejar errores de carga de imagen
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_IMAGE_URL;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-1/3 mt-4" />
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-16">
        <Car className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <p className="text-slate-500 text-lg">No se encontraron vehículos</p>
      </div>
    );
  }

  const getClientName = (ownerId) => {
    const client = clients ? clients.find((c) => c.id === ownerId) : null;
    return client?.full_name || null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-4">
      <AnimatePresence>
        {vehicles.map((vehicle) => {
          const normalizedStatus = statusMap[vehicle.status] || "en_mantenimiento";
          const statusConfig = STATUS_CONFIG[normalizedStatus];
          const clientName = getClientName(vehicle.owner_id);

          const imagePath = vehicle.imageUrl || vehicle.image_url;
          const fullImageUrl =
            imagePath && imagePath !== "/" ? `${API_BASE_URL}${imagePath}` : FALLBACK_IMAGE_URL;

          const formattedPrice = formatCurrency(parseFloat(vehicle.salePrice || vehicle.sale_price));
          const licensePlate = vehicle.license_plate || vehicle.LicensePlate;

          return (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Card className="overflow-hidden border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group flex flex-col h-full">
                {/* Sección de Imagen y Estatus */}
                <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                  <img
                    src={fullImageUrl}
                    onError={handleImageError}
                    alt={`${vehicle.brandName || vehicle.brandId} ${vehicle.modelName || vehicle.modelId}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 w-full p-2 bg-black/40 backdrop-blur-sm">
                    <Badge variant="default" className={`!rounded-lg ${statusConfig.color} text-sm`}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                </div>

                {/* Sección de Contenido */}
                <CardContent className="p-5 flex-grow flex flex-col">
                  <div className="mb-4 flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-0 leading-snug">
                        {vehicle.brandName || vehicle.brandId} {vehicle.modelName || vehicle.modelId}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {vehicle.year} • {vehicle.color}
                      </p>
                    </div>
                  </div>

                  {/* Precio de Venta */}
                  <div className="text-right">
                    <p
                      className={`text-2xl font-extrabold leading-none ${
                        formattedPrice === "N/A" ? "text-slate-400" : "text-green-700"
                      }`}
                    >
                      {formattedPrice}
                    </p>
                    <span className="text-xs text-slate-500 font-medium">Precio Venta</span>
                  </div>

                  <div className="space-y-2 mb-4 flex-grow">
                    {vehicle.mileage && (
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Gauge className="w-4 h-4 text-slate-500" />
                        <span>{vehicle.mileage.toLocaleString()} km</span>
                      </div>
                    )}

                    {vehicle.location && (
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span>{vehicle.location}</span>
                      </div>
                    )}

                    {clientName && (
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <User className="w-4 h-4 text-slate-500" />
                        <span className="font-medium">Propietario:</span> {clientName}
                      </div>
                    )}

                    {vehicle.licensePlate && (
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <span className="font-mono text-xs bg-blue-50 text-blue-800 px-3 py-1 rounded-full border border-blue-200 shadow-sm font-semibold">
                          PLACA: {vehicle.licensePlate}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Sección de Botones */}
                  <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                      onClick={() => onEdit(vehicle)}
                    >
                      <Edit className="w-4 h-4 mr-1" /> Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                      onClick={() => onDelete(vehicle.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
