import React, { useEffect } from 'react';
import { useLocation, Route, Routes } from 'react-router-dom';
import Sidebar from '../../sidebar/Sidebar';
import NotFoundScreen from '../../../screens/notFoundScreen/NotFoundScreen';
import { getUserData } from '../../../services/authService';
import './Main.css';
import { getAccessibleRoutes } from '../../../routes/accesibleRoutes';
import RoleSelectionScreen from '../../../screens/roleSelectionScreen/RoleSelectionScreen';

const Main = () => {
  const location = useLocation();
  const user = getUserData();

  useEffect(() => {
    window.scrollTo(0, 0); // Vuelve al principio de la página
  }, [location]);

  // Función para filtrar las rutas según el rol del usuario
  const accessibleRoutes = user ? getAccessibleRoutes(user.id_rol) : [];

  return (
    <div className="main-container">
      {/* Sidebar lateral */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="content bg-primary-gradient text-white">
        <Routes>
          {accessibleRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
          <Route path="/seleccionRol" element={<RoleSelectionScreen roles={user.roles} />} />
          {/* Ruta de fallback para páginas no encontradas */}
          <Route path="*" element={<NotFoundScreen />} />
        </Routes>
      </main>
    </div>
  );
};

export default Main;