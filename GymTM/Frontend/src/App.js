import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/errorBoundary/ErrorBoundary';
import RoutesWrapper from './components/routesWrapper/RoutesWrapper';

const App = () => (
  <AuthProvider>
    <ErrorBoundary>
      <Router>
        <RoutesWrapper />
      </Router>
    </ErrorBoundary>
  </AuthProvider>
);

export default App;