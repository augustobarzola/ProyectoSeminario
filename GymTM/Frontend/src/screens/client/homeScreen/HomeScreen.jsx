import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import './HomeScreen.css';
import { Link } from 'react-router-dom';

const HomeScreen = () => {
  return (
    <Container fluid className="home-screen text-white py-5">
      {/* Sección de bienvenida y motivación */}
      <Row className="align-items-center text-center mb-5 welcome-section">
        <Col>
          <h1 className="display-4">¡Bienvenido a tu transformación!</h1>
          <p className="lead">
            "Cada día es una nueva oportunidad para ser más fuerte, más rápido y mejor que ayer. ¡No te detengas!"
          </p>
          <Button variant="warning" size="lg" as={Link} to="/rutinas" className="mt-3">
            Ver rutinas de entrenamiento
          </Button>
        </Col>
      </Row>

      {/* Sección de servicios destacados */}
      <Row className="services-section text-center mb-5">
        <Col md={4}>
          <Card className="bg-dark text-white">
            <Card.Body>
              <Card.Title>Entrenamientos Personalizados</Card.Title>
              <Card.Text>
                Planes adaptados a tus metas con seguimiento de entrenadores calificados.
              </Card.Text>
              <Button variant="outline-light" as={Link} to="/entrenadores">Conoce más</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-dark text-white">
            <Card.Body>
              <Card.Title>Clases Grupales</Card.Title>
              <Card.Text>
                Disfruta de entrenamientos divertidos y en equipo. ¡Motívate con nosotros!
              </Card.Text>
              <Button variant="outline-light" as={Link} to="/clases">Explora las clases</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-dark text-white">
            <Card.Body>
              <Card.Title>Instalaciones de Primera</Card.Title>
              <Card.Text>
                Equipamiento de última generación y áreas acondicionadas para tu comodidad.
              </Card.Text>
              <Button variant="outline-light" as={Link} to="/instalaciones">Descubre nuestras instalaciones</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sección de frases motivacionales */}
      <Row className="motivational-section text-center">
        <Col>
          <h2>¡Tú puedes lograrlo!</h2>
          <p className="lead">
            "El dolor de hoy es la fuerza del mañana. Atrévete a superar tus límites."
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default HomeScreen;