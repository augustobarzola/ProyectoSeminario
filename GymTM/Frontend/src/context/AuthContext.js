import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserData, isAuthenticated, logout, login } from '../services/authService';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(false);
  const [userRoles, setUserRoles] = useState([]); // Manejar múltiples roles
  const [currentRole, setCurrentRole] = useState(null); // Rol seleccionado por el usuario
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (isAuthenticated()) {
        const user = await getUserData();
        if (user) {
          setUserRoles(user.roles || []); // Guardar los roles del usuario
          setCurrentRole(user.roles?.length === 1 ? user.roles[0].nombre : null); // Si solo hay un rol, seleccionarlo automáticamente
          setIsAdminLoggedIn(user.roles.some(role => role.id !== 4)); // Revisar si hay rol de admin
          setIsClientLoggedIn(user.roles.some(role => role.id === 4)); // Revisar si hay rol de cliente
        } else {
          setUserRoles([]);
          setCurrentRole(null);
          setIsAdminLoggedIn(false);
          setIsClientLoggedIn(false);
        }
      } else {
        setUserRoles([]);
        setCurrentRole(null);
        setIsAdminLoggedIn(false);
        setIsClientLoggedIn(false);
      }
      setLoading(false);
    };

    checkAuthentication();
  }, []);

  const handleLogin = async (documento, password) => {
    const result = await login(documento, password);
    if (result.success) {
      const user = await getUserData();
      if (user) {
        setUserRoles(user.roles || []);
        setCurrentRole(user.roles?.length === 1 ? user.roles[0].nombre : null);
        setIsAdminLoggedIn(user.roles.some(role => role.id !== 4));
        setIsClientLoggedIn(user.roles.some(role => role.id === 4));
      }
      return { success: true, userData: user };
    }
    return { success: false, message: result.message };
  };

  const handleLogout = () => {
    logout();
    setIsAdminLoggedIn(false);
    setIsClientLoggedIn(false);
    setCurrentRole(null);
    setUserRoles([]);
  };

  return (
    <AuthContext.Provider
      value={{
        isAdminLoggedIn,
        isClientLoggedIn,
        userRoles, // Los roles del usuario
        currentRole, // Rol seleccionado
        setCurrentRole, // Función para establecer el rol seleccionado
        loading,
        handleLogin,
        handleLogout,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};