import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { getData, updateData } from '../../services/dataService';
import toast from 'react-hot-toast';
import CustomSpinner from '../../components/customSpinner/CustomSpinner';
import CustomFormInput from '../../components/customFormInput/CustomFormInput';
import CustomButtonsGroup from '../../components/customButtonsGroup/CustomButtonsGroup';

const GymScreen = () => {
  const [mode, setMode] = useState('C'); // Modo inicial: Consulta
  const [gymData, setGymData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchGymData();
  }, []);

  const fetchGymData = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`gyms/1`); // Cambia por el ID del gym
      setGymData(response);
      reset(response);
    } catch (error) {
      toast.error('Error al obtener los datos del gym.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await updateData(`gyms/${gymData.id}`, data);
      toast.success('Datos del gym actualizados exitosamente.');
      setMode('C');
    } catch (error) {
      toast.error('Error al actualizar los datos del gym.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setMode('M');
  };

  const handleBack = () => {
    setMode('C');
  };

  return (
    <Container fluid className="py-4">
      {isLoading && <CustomSpinner />}
      {mode === 'C' && (
        <div>
          <h3 className="text-center">Datos del Gym</h3>
          {gymData ? (
            <Form>
              <CustomFormInput
                label="Nombre"
                controlId="nombre"
                defaultValue={gymData.nombre}
                register={register}
                errors={errors.nombre}
                disabled
              />
              <CustomFormInput
                label="Correo"
                controlId="correo"
                defaultValue={gymData.correo}
                register={register}
                errors={errors.correo}
                disabled
              />
              <CustomFormInput
                label="Teléfono"
                controlId="telefono"
                defaultValue={gymData.telefono}
                register={register}
                errors={errors.telefono}
                disabled
              />
              <h5 className="mt-4">Domicilio</h5>
              <CustomFormInput
                label="Calle"
                controlId="calle"
                defaultValue={gymData.domicilio.calle}
                register={register}
                errors={errors.calle}
                disabled
              />
              <CustomFormInput
                label="Número"
                controlId="numero"
                defaultValue={gymData.domicilio.numero}
                register={register}
                errors={errors.numero}
                disabled
              />
              <CustomFormInput
                label="Ciudad"
                controlId="ciudad"
                defaultValue={gymData.domicilio.ciudad}
                register={register}
                errors={errors.ciudad}
                disabled
              />
              <CustomFormInput
                label="Provincia"
                controlId="provincia"
                defaultValue={gymData.domicilio.provincia}
                register={register}
                errors={errors.provincia}
                disabled
              />
              <CustomFormInput
                label="Código Postal"
                controlId="codigo_postal"
                defaultValue={gymData.domicilio.codigo_postal}
                register={register}
                errors={errors.codigo_postal}
                disabled
              />
              <CustomFormInput
                label="País"
                controlId="pais"
                defaultValue={gymData.domicilio.pais}
                register={register}
                errors={errors.pais}
                disabled
              />
            </Form>
          ) : (
            <Alert variant="danger">No se encontraron datos del gym.</Alert>
          )}
          <div className="d-flex justify-content-center mt-3">
            <Button variant="primary" onClick={handleEdit}>Modificar Datos</Button>
          </div>
        </div>
      )}
      {mode === 'M' && (
        <div>
          <h3 className="text-center">Modificar Datos del Gym</h3>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <CustomFormInput
              label="Nombre"
              controlId="nombre"
              defaultValue={gymData.nombre}
              register={register}
              errors={errors.nombre}
            />
            <CustomFormInput
              label="Correo"
              controlId="correo"
              defaultValue={gymData.correo}
              register={register}
              errors={errors.correo}
            />
            <CustomFormInput
              label="Teléfono"
              controlId="telefono"
              defaultValue={gymData.telefono}
              register={register}
              errors={errors.telefono}
            />
            <h5 className="mt-4">Domicilio</h5>
            <CustomFormInput
              label="Calle"
              controlId="calle"
              defaultValue={gymData.domicilio.calle}
              register={register}
              errors={errors.calle}
            />
            <CustomFormInput
              label="Número"
              controlId="numero"
              defaultValue={gymData.domicilio.numero}
              register={register}
              errors={errors.numero}
            />
            <CustomFormInput
              label="Ciudad"
              controlId="ciudad"
              defaultValue={gymData.domicilio.ciudad}
              register={register}
              errors={errors.ciudad}
            />
            <CustomFormInput
              label="Provincia"
              controlId="provincia"
              defaultValue={gymData.domicilio.provincia}
              register={register}
              errors={errors.provincia}
            />
            <CustomFormInput
              label="Código Postal"
              controlId="codigo_postal"
              defaultValue={gymData.domicilio.codigo_postal}
              register={register}
              errors={errors.codigo_postal}
            />
            <CustomFormInput
              label="País"
              controlId="pais"
              defaultValue={gymData.domicilio.pais}
              register={register}
              errors={errors.pais}
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

export default GymScreen;