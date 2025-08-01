
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import Index from './pages/Index';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AutoLogout from './components/AutoLogout';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import { AdvancedNotificationService } from './services/AdvancedNotificationService';

function App() {
  // Initialize advanced notifications
  useEffect(() => {
    AdvancedNotificationService.initializeNotifications();
    
    // Cleanup on unmount
    return () => {
      AdvancedNotificationService.clearAllTimers();
    };
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <Navbar />
          <Index />
          <Footer />
          <AutoLogout />
          <ScrollToTop />
          <Toaster />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
