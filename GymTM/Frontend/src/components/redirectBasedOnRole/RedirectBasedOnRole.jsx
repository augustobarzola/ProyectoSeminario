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

  if (loading) {
    return <CustomSpinner />;
  }

  // Si el usuario tiene múltiples roles
  if (user?.roles?.length > 1) {
    return <RoleSelectionScreen roles={user.roles} />;
  }

  // Si el usuario tiene un solo rol
  if (user?.roles[0]?.id_rol === 3) {
    setCurrentRole('admin');
    return <Navigate to="/admin/rutinas" />;
  } else if (isAdminLoggedIn) {
    setCurrentRole('admin');
    return <Navigate to="/admin" />;
  } else if (isClientLoggedIn) {
    return <Navigate to="/" />;
  } else {
    return <LoginScreen />;
  }
};

export default RedirectBasedOnRole;