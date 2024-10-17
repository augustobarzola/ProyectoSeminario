import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CustomSpinner from '../customSpinner/CustomSpinner';
import RoleSelectionScreen from '../../screens/roleSelectionScreen/RoleSelectionScreen';
import { getUserData } from '../../services/authService';
import LoginScreen from '../../screens/loginScreen/LoginScreen';

const RedirectBasedOnRole = () => {
  const { isAdminLoggedIn, isClientLoggedIn, setCurrentRole } = useAuth();
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

  useEffect(() => {
    if (user?.roles?.length === 1) {
      setCurrentRole(user.roles[0]); // Actualiza el rol si solo tiene uno
    }
  }, [user, setCurrentRole]);

  if (loading) {
    return <CustomSpinner />;
  }

  // Función para manejar la redirección
  const getRedirectPath = () => {
    if (isAdminLoggedIn && user?.roles?.length > 1 && !user.id_rol) {
      return <RoleSelectionScreen />;
    }

    if (isAdminLoggedIn && (!user.id_rol || user.id_rol === 1)) {
      return <Navigate to="/admin" />;
    }

    if (isAdminLoggedIn && (!user.id_rol || user.id_rol === 2)) {
      return <Navigate to="/admin/asistencias" />;
    }

    if (isAdminLoggedIn && (!user.id_rol || user.id_rol == 3)) {
      return <Navigate to="/admin/rutinas" />;
    }

    if (isClientLoggedIn && (!user.id_rol || user.id_rol === 4)) {
      return <Navigate to="/" />;
    }
    
    return <LoginScreen />;
  };

  return getRedirectPath();
};

export default RedirectBasedOnRole;