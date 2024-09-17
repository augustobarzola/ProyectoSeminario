import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserData, isAuthenticated, logout, login } from '../services/authService';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (isAuthenticated()) {
        const user = await getUserData();
        if (user) {
          setIsAdminLoggedIn(user.rol === 1);
          setIsClientLoggedIn(user.rol === 2);
        } else {
          setIsAdminLoggedIn(false);
          setIsClientLoggedIn(false);
        }
      } else {
        setIsAdminLoggedIn(false);
        setIsClientLoggedIn(false);
      }
      setLoading(false);
    };

    checkAuthentication();
  }, []);

  const handleLogin = async (dni, password) => {
    const result = await login(dni, password);
    if (result.success) {
      const user = await getUserData();
      if (user) {
        setIsAdminLoggedIn(user.rol === 1);
        setIsClientLoggedIn(user.rol === 2);
      }
      return { success: true };
    }
    return { success: false, message: result.message };
  };

  const handleLogout = () => {
    logout();
    setIsAdminLoggedIn(false);
    setIsClientLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isAdminLoggedIn, isClientLoggedIn, loading, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};