import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import { routes } from '../../../constants/adminLinks'; 
import NotFoundScreen from '../../../screens/notFoundScreen/NotFoundScreen';
import './Main.css';

const Main = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Vuelve al principio de la página
    console.log(routes)
  }, [location]);

  return (
    <div className="main-container d-flex">
      {/* Sidebar lateral */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="content flex-grow-1 bg-primary-gradient text-white">
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
          {/* Ruta de fallback para páginas no encontradas */}
          <Route path="*" element={<NotFoundScreen />} />
        </Routes>
      </main>
    </div>
  );
};

export default Main;