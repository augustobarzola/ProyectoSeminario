import React, { useEffect, useState, useContext } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';
import { getUserData } from '../../services/authService';
import CustomTooltip from '../customTooltip/CustomTooltip';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getAccessibleRoutes } from '../../routes/accesibleRoutes';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useConfirmationModal } from '../confirmationModalProvider/ConfirmationModalProvider';

const Sidebar = () => {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { handleLogout } = useContext(AuthContext);
  const openConfirmationModal = useConfirmationModal();

  const onLogout = () => {
    openConfirmationModal({
      title: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      onConfirm: async () => {
        handleLogout();
        navigate('/login'); // Redirige al usuario al login si no está autenticado
      }
    });
  };
  
  useEffect(() => {
    const data = getUserData();
    setUser(data);
  }, []);

  // Función para colapsar/expandir el sidebar
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const accessibleRoutes = user ? getAccessibleRoutes(user.id_rol) : [];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header d-flex justify-content-between align-items-center">
        <span className="brand ms-1">{!isCollapsed && user?.usuario}</span>
        <Button variant="dark" onClick={toggleSidebar} className="toggle-btn">
          {isCollapsed ? '>' : '<'}
        </Button>
      </div>
      <Nav className="flex-column mt-4">
        {accessibleRoutes.map((route, index) => (
          <Nav.Link 
            as={Link} 
            to={`${user.id_rol !== 4 ? '/admin' : ''}${route.path}`} 
            key={index} 
            className="d-flex align-items-center"
            style={{ color: route.color }} // Establece el color de cada enlace
          >
            <CustomTooltip tooltipText={route.label}>
              <FontAwesomeIcon icon={route.icon} className="sidebar-icon" />
            </CustomTooltip>
            {!isCollapsed && <span className="ms-2">{route.label}</span>}
          </Nav.Link>
        ))}
        <Nav.Link as="span" onClick={onLogout} className="d-flex align-items-center pointer">
          <CustomTooltip tooltipText="Cerrar sesión">
            <FontAwesomeIcon icon={faSignOutAlt} className="sidebar-icon" />
          </CustomTooltip>
          {!isCollapsed && <span className="ms-2">Cerrar sesión</span>}
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;