import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { getData, updateData } from '../../services/dataService';
import toast from 'react-hot-toast';
import CustomSpinner from '../../components/customSpinner/CustomSpinner';
import CustomFormInput from '../../components/customFormInput/CustomFormInput';
import CustomButtonsGroup from '../../components/customButtonsGroup/CustomButtonsGroup';
import CustomFormInputPassword from '../../components/customFormInputPassword/CustomFormInputPassword';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const PerfilScreen = () => {
  const [mode, setMode] = useState('C'); // Modo inicial: Consulta
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword, formState: { errors: errorsPassword }, watch: watchPassword } = useForm();

  const formInitialValue = {
    contrasenia: '',
    repetir_contrasenia: ''
  };

  const password = watchPassword('nueva_contrasenia'); // Obtenemos el valor de la primera contraseña

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const userData = localStorage.getItem('userData'); 
      const userId = JSON.parse(userData).id_usuario;

      const response = await getData(`usuarios/${userId}`);
      setUserData(response);
      reset(response);
    } catch (error) {
      toast.error('Error al obtener datos del usuario.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      await updateData('usuarios/updatePassword', { id: userData.id_usuario, body: data });
      toast.success('Contraseña actualizada exitosamente.');

      handleBack();
    } catch (error) {
      toast.error('Error al actualizar la contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setMode('M');
  };

  const handleBack = () => {
    setMode('C');
    resetPassword(formInitialValue);
  };

  return (
    <Container fluid className="py-4">
      {isLoading && <CustomSpinner />}
      {mode === 'C' && (
        <div>
          <h3 className="text-center">Datos de Usuario</h3>
          {userData ? (
            <Form>
              <CustomFormInput
                label="Usuario"
                controlId="usuario"
                defaultValue={userData.usuario}
                register={register}
                errors={errors.usuario}
                disabled
              />
              <CustomFormInput
                label="Rol"
                controlId="rol"
                defaultValue={userData.rol}
                register={register}
                errors={errors.rol}
                disabled
              />
              <CustomFormInput
                label="Nombre"
                controlId="nombre"
                defaultValue={userData.nombre}
                register={register}
                errors={errors.nombre}
                disabled
              />
              <CustomFormInput
                label="Apellido"
                controlId="apellido"
                defaultValue={userData.apellido}
                register={register}
                errors={errors.apellido}
                disabled
              />
              <CustomFormInput
                label="Correo"
                controlId="correo"
                defaultValue={userData.correo}
                register={register}
                errors={errors.correo}
                disabled
              />
              <CustomFormInput
                label="Teléfono"
                controlId="telefono"
                defaultValue={userData.telefono}
                register={register}
                errors={errors.telefono}
                disabled
              />
            </Form> 
          ) : (
            <Alert variant="danger">No se encontraron datos de usuario.</Alert>
          )}
          <div className="d-flex justify-content-center mt-3">
            <Button variant="primary" onClick={handleEdit} size="lg"><FontAwesomeIcon icon={faEdit} style={{ cursor: 'pointer' }} /> Modificar Contraseña</Button>
          </div>
        </div>
      )}
      {mode === 'M' && (
        <div>
          <h3 className="text-center">Cambiar Contraseña</h3>
          <Form onSubmit={handleSubmitPassword(onSubmit)}>
            <CustomFormInputPassword
              label="Nueva Contraseña"
              controlId="nueva_contrasenia"
              register={registerPassword}
              errors={errorsPassword}
            />
            <CustomFormInputPassword
              label="Repetir Contraseña"
              controlId="repetir_contrasenia"
              register={registerPassword}
              errors={errorsPassword}
              placeholder="Repita su contraseña"
              validate={{
                validate: {
                  matchesPreviousPassword: (value) => {
                    const password = watchPassword('nueva_contrasenia');
                    return password === value || 'Las contraseñas no coinciden.';
                  },
                },
              }}
            />

            <CustomButtonsGroup
              mode={mode}
              isSubmitting={isLoading}
              handleBack={handleBack}
            />
          </Form>
        </div>
      )}
    </Container>
  );
};

export default PerfilScreen;