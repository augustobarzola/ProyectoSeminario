import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginScreen from '../../screens/loginScreen/LoginScreen';
// import AdminLayout from './AdminLayout'; 
// import ClientLayout from './ClientLayout';
import PrivateRoute from '../../routes/privateRoute';
import CustomSpinner from '../customSpinner/CustomSpinner';

import { ConfirmationModalProvider } from '../confirmationModalProvider/ConfirmationModalProvider';
import ClientHeader from '../client/header/Header';
import ClientMain from '../client/main/Main';
import ClientFooter from '../client/footer/Footer';
import AdminHeader from '../admin/header/Header';
import AdminMain from '../admin/main/Main';
import AdminFooter from '../admin/footer/Footer';
import { getUserData } from '../../services/authService';

const AdminLayout = () => (
  <ConfirmationModalProvider>
    <AdminHeader />
    <AdminMain />
    <AdminFooter />
  </ConfirmationModalProvider>
);

const ClientLayout = () => (
  <ConfirmationModalProvider>
    <ClientHeader />
    <ClientMain />
    <ClientFooter />
  </ConfirmationModalProvider>
);

const RoutesWrapper = () => {
  const { isAdminLoggedIn, isClientLoggedIn, loading } = useAuth();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const data = getUserData();
    setUser(data);
  }, []);

  if (loading) {
    return <CustomSpinner />;
  }

  return (
    <Routes>
      {/* Redirige al login si ya está autenticado */}
      <Route
        path="/login"
        element={
          isAdminLoggedIn ? (
            user?.id_rol === 3 ? <Navigate to="/admin/rutinas" /> : <Navigate to="/admin" />
          ) : isClientLoggedIn ? (
            <Navigate to="/" />
          ) : (
            <LoginScreen />
          )
        }
      />
      {/* Rutas protegidas por rol */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute role="admin">
            <AdminLayout />
          </PrivateRoute>
        }
      />
      <Route
        path="/*"
        element={
          <PrivateRoute role="client">
            <ClientLayout />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default RoutesWrapper;