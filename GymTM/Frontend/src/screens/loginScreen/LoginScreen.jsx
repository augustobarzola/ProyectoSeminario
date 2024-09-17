// src/screens/loginScreen/LoginScreen.js
import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo_icon.png';
import './LoginScreen.css';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate(); 
  const { handleLogin } = useAuth(); 

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
    <div className="container-fluid d-flex align-items-center bg-dark text-light" style={{ height: '100vh' }}>
      <div className="container">  
        <div className="d-flex justify-content-center align-items-center mb-4">
          <img src={logo} alt="GymTM Logo" className="logo-image-login"/>
          <h1 className="text-center ms-3 bold">GymTM</h1>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="dni">
            <Form.Label>DNI</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese su dni"
              className="bg-dark text-white border border-secondary"
              {...register('dni', { required: true })}
            />
            {errors.dni && <p className="text-danger">Por favor, ingrese su dni.</p>}
          </Form.Group>

          <Form.Group controlId="password" className="mt-4">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingrese su contraseña"
              className="bg-dark text-white border border-secondary"
              {...register('password', { required: true })}  
            />
            {errors.password && <p className="text-danger">Por favor, ingrese su contraseña.</p>}
          </Form.Group>

          {loginError && <Alert variant="danger" className="mt-4">{loginError}</Alert>}

          <div className="text-center mt-4">
            <Button variant="primary" type="submit" size="lg">
              <i className="fa-solid fa-arrow-right-to-bracket"></i> Iniciar sesión
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;