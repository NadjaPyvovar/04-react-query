import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'modern-normalize/modern-normalize.css';

import App from './components/App/App';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);

// notes: adding import Tanstack Query tools; creating one shared query client instance for the whole app (i.e. const queryClient = new QueryClient()); adding wrap App so all components can use useQuery (i.e. <QueryClientProvider client={queryClient}></QueryClientProvider>)
// details: TanStack Query requires a QueryClient (i.e. cache/manager) to be created once at the top level and passed down via QueryClientProvider, so that each component can call useQuery and all the components share the same cache
