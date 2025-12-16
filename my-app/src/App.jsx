import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./components/Layout";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

function App(/*{ keycloak }*/) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout /*keycloak={keycloak}*/ />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;