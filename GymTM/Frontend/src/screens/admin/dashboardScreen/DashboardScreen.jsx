import React from 'react';
import './DashboardScreen.css';
import { Container, Alert } from 'react-bootstrap';

const DashboardScreen = () => {

  return (
    <Container fluid className="py-4">
      <h3 className="text-center">DASHBOARD</h3>
      <Alert variant="warning" className="text-center h3 mt-4">
        Proximamente... <i className="fa-solid fa-person-digging"></i>
      </Alert>
    </Container>
  );
}

export default DashboardScreen;