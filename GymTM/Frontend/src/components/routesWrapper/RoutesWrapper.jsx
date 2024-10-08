import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginScreen from '../../screens/loginScreen/LoginScreen';
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

// Layouts
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

// Componente para manejar la redirección basada en el rol del usuario
const RedirectBasedOnRole = () => {
  const { isAdminLoggedIn, isClientLoggedIn } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData();
      setUser(data);
      setLoading(false);
    };
    fetchUserData();
  }, []);

  if (loading) {
    return <CustomSpinner />;
  }

  // Redirigir según el rol del usuario
  if (user?.id_rol === 3) {
    return <Navigate to="/admin/rutinas" />;
  } else if (isAdminLoggedIn) {
    return <Navigate to="/admin" />;
  } else if (isClientLoggedIn) {
    return <Navigate to="/" />;
  } else {
    return <LoginScreen />;
  }
};

const RoutesWrapper = () => {
  return (
    <Routes>
      {/* Rutas */}
      <Route path="/login" element={<RedirectBasedOnRole />} />
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