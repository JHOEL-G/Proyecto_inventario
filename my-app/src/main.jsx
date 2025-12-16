import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Toaster } from 'sonner';
import App from './App.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import keycloak from './lib/keycloak.js';

// Crear el cliente de React Query
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  </StrictMode>
);

// keycloak
//   .init({
//     onLoad: "login-required",
//     checkLoginIframe: false,
//     redirectUri: import.meta.env.VITE_APP_URL,
//   })
//   .then((authenticated) => {
//     if (authenticated) {
//       console.log("✅ Authenticated");
//       createRoot(document.getElementById('root')).render(
//         <StrictMode>
//           <QueryClientProvider client={queryClient}>
//             <App keycloak={keycloak} />
//           </QueryClientProvider>
//         </StrictMode>
//       );
//     } else {
//       console.warn("❌ Not authenticated");
//       window.location.reload();
//     }
//   })
//   .catch((err) => {
//     console.error("❌ Error inicializando Keycloak:", err);
//   });