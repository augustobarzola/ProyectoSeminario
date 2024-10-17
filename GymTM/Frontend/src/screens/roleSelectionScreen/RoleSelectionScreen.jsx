import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserData, setSelectedRole } from '../../services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faUserTie, faConciergeBell, faDumbbell, faUser } from '@fortawesome/free-solid-svg-icons';
import gymBackground from '../../assets/gymBackground.jpg';
import { useIsMobile } from '../../hooks/useIsMobile';

const RoleSelectionScreen = () => {
  const navigate = useNavigate();
  const { setCurrentRole } = useAuth();
  const [user, setUser] = useState(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData();
      setUser(data);
    };
    fetchUserData();
  }, []);

  const handleRoleSelect = (role) => {
    setCurrentRole(role);
    setSelectedRole(role);

    // Redirigir a la pantalla correspondiente según el rol
    if (role.id === 1) { //Falta corregir ya que el id rol 1 es sistemas
      navigate('/admin');
    } else if (role.id === 2) {
      navigate('/admin');
    } else if (role.id === 3) {
      navigate('/admin/asistencias');
    } else if (role.id === 4) {
      navigate('/admin/rutinas');
    } else {
      navigate('/');
    }
  };

  const rolesIcon = [ faUserShield, faUserTie, faConciergeBell, faDumbbell, faUser ];

  return (
    <div className="d-flex align-items-center bg-login bg-dark" style={{ height: '100vh', backgroundImage: `url(${gymBackground})` }}>
      <Container className={`bg-dark text-light rounded p-5 shadow-lg ${isMobile && 'containerMobileLogin'}`}>
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <h2 style={{ color: '#ecf0f1' }}>Selecciona tu rol</h2>
          </Col>
        </Row>
        <Row className="mt-4 justify-content-center">
          {user?.roles?.map((role) => (
            <Col md={4} className="mb-4" key={role.id}>
              <Card
                className="text-white"
                style={{
                  backgroundColor: '#34495e',
                  border: 'none',
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
              >
                <Card.Body className="d-flex flex-column align-items-center">
                  <FontAwesomeIcon icon={rolesIcon[role.id - 1]} size="3x" style={{ color: '#f1c40f' }} />
                  <Card.Title className="mt-3" style={{ fontSize: '1.5rem' }}>{role.nombre}</Card.Title>
                  <Card.Text className="text-secondary">{role.descripcion}</Card.Text>
                  <Button variant="primary" onClick={() => handleRoleSelect(role)}>
                    Seleccionar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default RoleSelectionScreen;