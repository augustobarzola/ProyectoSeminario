import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Container } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { getData, insertData } from '../../../../services/dataService';
import toast from 'react-hot-toast';
import CustomSpinner from '../../../../components/customSpinner/CustomSpinner';
import CustomFormInput from '../../../../components/customFormInput/CustomFormInput';
import CustomButtonsGroup from '../../../../components/customButtonsGroup/CustomButtonsGroup';
import showErrorMessage from '../../../../utils/showErrorMessage';

const ExerciseCreationForm = ({mode, handleBack, onExerciseCreated }) => {
  const [exercises, setExercises] = useState([]); // Lista de ejercicios
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const initialExerciseFormState = {
    nombre: '',
    descripcion: ''
  };

  // Obtener lista de ejercicios
  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    setIsLoading(true);
    try {
      const response = await getData('ejercicios'); // Aquí llamas a tu endpoint que trae los ejercicios
      setExercises(response);
    } catch (error) {
      showErrorMessage('Error al obtener ejercicios', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Guardar nuevo ejercicio
  const onSubmitExercise = async (data) => {
    setIsLoading(true);
    try {
      await insertData('ejercicios', { body: data }); // Aquí llamas a tu endpoint para insertar un ejercicio
      toast.success('Ejercicio creado exitosamente');
      reset(initialExerciseFormState); // Reiniciar el formulario después de crear
      fetchExercises(); // Refrescar la lista de ejercicios
    } catch (error) {
      showErrorMessage('Error al crear el ejercicio', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <h3 className="text-center">Crear Ejercicio</h3>
      <Form onSubmit={handleSubmit(onSubmitExercise)}>
        <CustomFormInput
          label="Nombre del Ejercicio"
          controlId="nombre"
          register={register}
          errors={errors.nombre}
          placeholder="Ingrese el nombre del ejercicio"
        />
        <CustomFormInput
          label="Descripción"
          controlId="descripcion"
          register={register}
          errors={errors.descripcion}
          placeholder="Ingrese una breve descripción del ejercicio"
          as="textarea" // Cambiar a textarea para la descripción
        />
        <CustomButtonsGroup 
          mode={mode} 
          isSubmitting={isLoading} 
          handleBack={handleBack} 
        />
      </Form>

      <h3 className="text-center mt-5">Listado de Ejercicios</h3>
      {isLoading ? (
        <CustomSpinner />
      ) : (
        <Table striped bordered hover variant="dark" className="custom-border" responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map(exercise => (
              <tr key={exercise.id}>
                <td>{exercise.nombre}</td>
                <td>{exercise.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ExerciseCreationForm;