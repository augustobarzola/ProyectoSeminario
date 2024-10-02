import React, { useState, useEffect } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUsers, faDumbbell, faRunning, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Importación de íconos
import './Sidebar.css';
import { getUserData } from '../../../services/authService';
import { routes } from '../../../constants/adminLinks'; 

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const data = getUserData();
    setUser(data);
  }, []);

  // Función para colapsar/expandir el sidebar
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  // Detectar el tamaño de pantalla y ajustar el estado
  const updateMobileView = () => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    updateMobileView();
    window.addEventListener('resize', updateMobileView);
    return () => window.removeEventListener('resize', updateMobileView);
  }, []);

  return (
    <>
      {!isMobile ? (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header d-flex justify-content-between align-items-center">
            <span className="brand">{!isCollapsed && user?.dni}</span>
            <Button variant="dark" onClick={toggleSidebar} className="toggle-btn">
              {isCollapsed ? '>' : '<'}
            </Button>
          </div>
          <Nav className="flex-column mt-4">
            {routes.map((route, index) => (
              <Nav.Link href={`/admin${route.path}`} key={index} className="d-flex align-items-center">
                <FontAwesomeIcon icon={route.icon} className="sidebar-icon" />
                {!isCollapsed && <span className="ms-2">{route.label}</span>}
              </Nav.Link>
            ))}
            <Nav.Link href="/logout" className="d-flex align-items-center">
              <FontAwesomeIcon icon={faSignOutAlt} className="sidebar-icon" />
              {!isCollapsed && <span className="ms-2">Cerrar sesión</span>}
            </Nav.Link>
          </Nav>
        </div>
      ) : (
        <>
          {/* Para vista móvil */}
          <Button variant="dark" onClick={toggleSidebar} className="mobile-menu-btn">
            &#9776;
          </Button>
          {isCollapsed && (
            <div className="mobile-sidebar">
              {/* <span className="text-end">{user?.dni}</span> */}
              <Nav className="flex-column mt-4">
                {routes.map((route, index) => (
                  <Nav.Link href={`/admin${route.path}`} key={index} className="d-flex align-items-center">
                    <FontAwesomeIcon icon={route.icon} className="sidebar-icon" />
                    <span className="ms-2">{route.label}</span>
                  </Nav.Link>
                ))}
                <Nav.Link href="/logout" className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faSignOutAlt} className="sidebar-icon" />
                  <span className="ms-2">Cerrar sesión</span>
                </Nav.Link>
              </Nav>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Sidebar;