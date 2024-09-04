import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HomeScreen from '../../../screens/admin/homeScreen/HomeScreen';
import { Route, Routes } from 'react-router-dom';
import './Main.css';

const Main = () => {
  const location = useLocation();

  useEffect(() => {
    // Se ejecuta cada vez que cambia la ruta
    window.scrollTo(0, 0); // Vuelve al principio de la página
  }, [location]);

  return (
    <main className="min-vh bg-primary-gradient text-white">
      <Routes>
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </main>
  );
}

export default Main;