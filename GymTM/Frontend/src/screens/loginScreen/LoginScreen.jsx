import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './LoginScreen.css';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate(); 

  const onSubmit = async (data) => {
    // Validaciones básicas
    if (!data.dni || !data.password) {
      console.error('Por favor, complete todos los campos.');
      return;
    }
  
    // Loguearse: await login(data.email, data.password);
    navigate('/'); // Redirige al usuario al inicio si está autenticado
  };

  return (
    <div className="container-fluid d-flex align-items-center bg-dark text-light" style={{ height: '100vh' }}>
      <div className="container">  
        <h1 className="text-center">GymTM</h1>
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

          <div className="text-center mt-5">
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
