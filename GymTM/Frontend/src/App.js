import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/errorBoundary/ErrorBoundary';
import RoutesWrapper from './components/routesWrapper/RoutesWrapper';
import { Toaster } from 'react-hot-toast';
import { useIsMobile } from './hooks/useIsMobile';

const App = () => {
  const isMobile = useIsMobile();

  return (
  <AuthProvider>
    <ErrorBoundary>
      <Router>
        <RoutesWrapper />
        <Toaster
          position={isMobile ? "top-center" : "top-right"}
          reverseOrder={false}
          toastOptions={{
            error: {
              duration: 3000,
            },
          }}
        />
      </Router>
    </ErrorBoundary>
  </AuthProvider>
)
};

export default App;