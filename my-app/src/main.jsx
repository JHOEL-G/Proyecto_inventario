import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import keycloak from './auth/keycloak';

// Crear el cliente de React Query
const queryClient = new QueryClient();

keycloak
  .init({
    onLoad: "login-required",
    checkLoginIframe: false,
    redirectUri: import.meta.env.VITE_APP_URL,
  })
  .then(() => {
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <App keycloak={keycloak} />
        </QueryClientProvider>
      </StrictMode>
    );
  })
  .catch((err) => {
    console.error("❌ Error inicializando Keycloak:", err);
  });

