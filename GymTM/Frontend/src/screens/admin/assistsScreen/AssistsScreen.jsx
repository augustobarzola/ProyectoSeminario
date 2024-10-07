import React from 'react';
import './AssistsScreen.css';
import { Container, Alert } from 'react-bootstrap';

const AssistsScreen = () => {

  return (
    <Container fluid className="py-4">
      <h3 className="text-center">ASISTENCIAS</h3>
      <Alert variant="warning" className="text-center h3 mt-4">
        Proximamente... <i className="fa-solid fa-person-digging"></i>
      </Alert>
    </Container>
  );
}

export default AssistsScreen;