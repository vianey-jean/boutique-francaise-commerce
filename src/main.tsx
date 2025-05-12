
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { StoreProvider } from './contexts/StoreContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { VideoCallProvider } from './contexts/VideoCallContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './utils/polyfills';  // Import polyfills first

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StoreProvider>
            <NotificationProvider>
              <VideoCallProvider>
                <App />
                <Toaster position="top-right" />
              </VideoCallProvider>
            </NotificationProvider>
          </StoreProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
