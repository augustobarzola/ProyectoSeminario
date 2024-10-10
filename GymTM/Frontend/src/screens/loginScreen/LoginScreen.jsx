import React, { useState } from 'react';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo_icon.png';
import './LoginScreen.css';
import { useAuth } from '../../context/AuthContext';
import gymBackground from '../../assets/gymBackground.jpg';
import { useIsMobile } from '../../hooks/useIsMobile';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate(); 
  const { handleLogin } = useAuth(); 
  const isMobile = useIsMobile();

  const onSubmit = async (data) => {
    setLoginError(null); // Resetear mensaje de error
    const result = await handleLogin(data.dni, data.password);
    
    if (result.success) {
      navigate('/'); // Redirige al usuario al inicio si está autenticado
    } else {
      setLoginError(result.message); // Mostrar mensaje de error
    }
  };

  return (
    <div className="d-flex align-items-center bg-login bg-dark" style={{ height: '100vh', backgroundImage: `url(${gymBackground})` }}>
      <Container className={`bg-dark text-light rounded p-5 shadow-lg ${isMobile && 'containerMobileLogin'}`}>
        <Row className="justify-content-center mb-4">
          <Col className="text-center">
            <img src={logo} alt="GymTM Logo" className="logo-image-login mb-3" />
            <h1 className="text-white bold">Bienvenido a GymTM</h1>
            <p className="text-white-50">"La grandeza se construye con esfuerzo. ¡Hoy es tu día para empezar!"</p> {/* Mensaje motivacional */}
          </Col>
        </Row>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="dni" className="mb-3">
            <Form.Label>Documento</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese su Documento"
              className="bg-dark text-white border-secondary"
              {...register('dni', { required: true })}
            />
            {errors.dni && <p className="text-danger">Por favor, ingrese su Documento.</p>}
          </Form.Group>

          <Form.Group controlId="password" className="mb-4">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingrese su contraseña"
              className="bg-dark text-white border-secondary"
              {...register('password', { required: true })}  
            />
            {errors.password && <p className="text-danger">Por favor, ingrese su contraseña.</p>}
          </Form.Group>

          {loginError && <Alert variant="danger">{loginError}</Alert>}

          <div className="text-center">
            <Button variant="success" type="submit" size="lg" className={`w-50 ${isMobile && 'w-100'}`}>
              <i className="fa-solid fa-arrow-right-to-bracket"></i> Iniciar sesión
            </Button>
          </div>
        </Form>

        <div className="text-center mt-4">
          <p className="text-white-50">¿Olvidaste tu contraseña? <a href="https://api.whatsapp.com/send?phone=543572447942&text=¡Hola! Quiero recuperar mi contraseña de GymTM." className="text-white">Recupérala aquí</a></p>
        </div>
      </Container>
    </div>
  );
};

export default Login;