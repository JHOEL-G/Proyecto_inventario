import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ✅ Genera las rutas correctas según el nombre de la página
export function createPageUrl(pageName) {
  switch (pageName.toLowerCase()) {
    case "dashboard":
      return "/dashboard";
    case "clients":
      return "/clients";
    case "vehicles":
      return "/vehicles";
    case "maintenance":
      return "/maintenance";
    case "reports":
      return "/reports";
    default:
      return "/";
  }
}
