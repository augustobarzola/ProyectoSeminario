import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RoleSelectionScreen = ({ roles }) => {
  const navigate = useNavigate();
  const { setCurrentRole } = useAuth(); // Suponiendo que tienes una función para establecer el rol

  const handleRoleSelect = (role) => {
    setCurrentRole(role); // Guardar el rol seleccionado en el contexto
    // Redirigir a la pantalla correspondiente según el rol
    if (role.id === 1 || role.id === 2) {
      navigate('/admin'); 
    } else if (role.id === 3) {
      navigate('/admin/rutinas'); 
    } else {
      navigate('/'); 
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <h2>Selecciona tu rol</h2>
          {roles.map((role) => (
            <Button key={role.id} variant="primary" className="m-2" onClick={() => handleRoleSelect(role)}>
              {role.nombre}
            </Button>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default RoleSelectionScreen;