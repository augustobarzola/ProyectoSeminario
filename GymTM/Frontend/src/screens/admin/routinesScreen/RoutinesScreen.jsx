import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Container, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { getData, insertData, updateData, deleteData } from '../../../services/dataService';
import toast from 'react-hot-toast';
import CustomSpinner from '../../../components/customSpinner/CustomSpinner';
import CustomFormInput from '../../../components/customFormInput/CustomFormInput';
import CustomFormSelect from '../../../components/customFormSelect/CustomFormSelect';
import ActionButtons from '../../../components/actionButtons/ActionButtons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ExerciseCreationForm from './exerciseCreationForm/ExerciseCreationForm'; 
import CustomDateTimePicker from '../../../components/customDateTimePicker/CustomDateTimePicker';
import { getUserData } from '../../../services/authService';
import { useIsMobile } from '../../../hooks/useIsMobile';
import CustomButtonsGroup from '../../../components/customButtonsGroup/CustomButtonsGroup';
import showErrorMessage from '../../../utils/showErrorMessage';

const RoutinesScreen = () => {
  const [mode, setMode] = useState('L'); // Modos: L = Listar, A = Alta, M = Modificar, C = Consultar, Asignar, E = Crear Ejercicio
  const [routines, setRoutines] = useState([]); 
  const [exercises, setExercises] = useState([]); 
  const [selectedRoutine, setSelectedRoutine] = useState(null); 
  const [clients, setClients] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const isMobile = useIsMobile();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const initialRoutineFormState = {
    nombre_rutina: '',
    descripcion: '',
    ejercicios: [], // Aquí se agregan los ejercicios seleccionados con sus detalles
    id_entrenador: ''
  };
  
  // Estado adicional para los detalles de cada ejercicio
  const [selectedExercise, setSelectedExercise] = useState(null); // Ejercicio seleccionado
  const [exerciseDetails, setExerciseDetails] = useState({
    series: '',
    repeticiones: '',
    tiempo_descanso: '',
    explicacion: ''
  });
  

  useEffect(() => {
    const userData = getUserData();
    setUser(userData);
    if (mode === 'L') {
      fetchRoutines();
    }
  }, [mode]);

  // Obtener rutinas
  const fetchRoutines = async () => {
    setIsLoading(true);
    try {
      const response = await getData('rutinas', { user: user });
      setRoutines(response);
    } catch (error) {
      showErrorMessage('Error al obtener rutinas', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener ejercicios
  const fetchExercises = async () => {
    try {
      const response = await getData('ejercicios');
      setExercises(response);
    } catch (error) {
      showErrorMessage('Error al obtener ejercicios', error);
    }
  };

  // Cambiar a modo Alta
  const handleAdd = () => {
    reset(initialRoutineFormState);
    fetchExercises(); 
    setMode('A');
  };

  // Cambiar a modo Modificar
  const handleEdit = async (id) => {
    try {
      const routine = await getData(`rutinas/${id}`);
      reset(routine);
      setMode('M');
    } catch (error) {
      showErrorMessage('Error al obtener la rutina', error);
    }
  };

  // Cambiar a modo Consultar
  const handleConsult = async (id) => {
    try {
      const routine = await getData(`rutinas/${id}`);
      reset(routine);
      setMode('C');
    } catch (error) {
      showErrorMessage('Error al obtener la rutina', error);
    }
  };

  const handleCreateExercise = () => {
    setMode('E');
  }

  const handleDelete = async (id) => {
    try {
      await deleteData('rutinas', id);
      toast.success('Rutina eliminada exitosamente');
      fetchRoutines(); // Refrescar la lista de rutinas
    } catch (error) {
      showErrorMessage('Error al eliminar la rutina', error);
    }
  };

  // Cambiar a modo Crear Ejercicio
  const handleExerciseCreation = () => {
    setMode('E');
  };

  const addExerciseToRoutine = () => {
    const newExercise = {
      id_ejercicio: selectedExercise.id,
      nombre: selectedExercise.nombre,
      ...exerciseDetails // Series, repeticiones, descanso, observación
    };
  
    setRoutines(prevState => ({
      ...prevState,
      ejercicios: [...prevState.ejercicios, newExercise] // Añade el nuevo ejercicio a la lista
    }));
  
    // Limpia el formulario de ejercicios
    setSelectedExercise(null);
    setExerciseDetails({ series: '', repeticiones: '', tiempo_descanso: '', explicacion: '' });
  };
  
  // Guardar rutina
  const onSubmitRoutine = async (data) => {
    setIsLoading(true);
    try {
      if (mode === 'A') {
        await insertData('rutinas', { body: { ...data, id_entrenador: user.id, ejercicios: routines.ejercicios } });
        toast.success('Rutina creada exitosamente');
      } else if (mode === 'M') {
        await updateData(`rutinas/${selectedRoutine.id}`, { body: { ...data, ejercicios: routines.ejercicios } });
        toast.success('Rutina modificada exitosamente');
      }
      setMode('L');
    } catch (error) {
      showErrorMessage('Error al guardar la rutina', error);
    } finally {
      setIsLoading(false);
    }
  };  

  // Volver al listado o a la creación de rutina
  const handleBack = () => {
    if (mode === 'E') {
      setMode('A'); // Vuelve al modo Alta
    } else {
      setMode('L');
    }
    reset(initialRoutineFormState);
  };

  return (
    <Container fluid className="py-4">
      {/* Modo listado de rutinas */}
      {mode === 'L' && (
        <>
          <h3 className="text-center">Rutinas</h3>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Control className={`bg-obscure custom-border text-white w-35 ${isMobile && 'w-100 me-2'}`} type="text" placeholder="Buscar rutinas" />
            <Button variant="success" onClick={handleAdd}><FontAwesomeIcon icon={faPlus} /> {!isMobile && 'Crear rutina'}</Button>
          </div>
          <Table striped bordered hover variant="dark" className="custom-border" responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Entrenador</th>
                <th>Fecha de Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {routines.map(routine => (
                <tr key={routine.id}>
                  <td>{routine.nombre_rutina}</td>
                  <td>{routine.descripcion}</td>
                  <td>{routine.entrenador_nombre}</td>
                  <td>{routine.fecha_creacion}</td>
                  <td className="text-center">
                    <ActionButtons 
                      handleConsult={handleConsult} 
                      handleEdit={handleEdit} 
                      handleDelete={handleDelete} 
                      item={routine} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {/* Modo crear, consultar o modificar rutina */}
      {(mode === 'A' || mode === 'M' || mode === 'C') && (
        <>
          <h3>
            {mode === 'A' ? 'Crear Rutina' : mode === 'M' ? 'Modificar Rutina' : 'Consultar Rutina'}
          </h3>
          <Form onSubmit={handleSubmit(onSubmitRoutine)}>
            <CustomFormInput
              label="Nombre de la Rutina"
              controlId="nombre_rutina"
              register={register}
              errors={errors.nombre_rutina}
            />
            <CustomFormInput
              label="Descripción"
              controlId="descripcion"
              register={register}
              errors={errors.descripcion}
            />
            
            {/* Agregar sección para seleccionar ejercicios y sus detalles */}
            <h4 className="text-center">Detalle de la rutina</h4>
            <CustomFormSelect
              label="Ejercicio"
              controlId="selectedExercise"
              register={register}
              options={exercises} // Las opciones deben provenir del fetchExercises
              value={selectedExercise}
              onChange={e => setSelectedExercise(exercises.find(ex => ex.id === e.target.value))}
            />
            <CustomFormInput
              label="Series"
              controlId="series"
              register={register}
              value={exerciseDetails.series}
              onChange={e => setExerciseDetails({ ...exerciseDetails, series: e.target.value })}
            />
            <CustomFormInput
              label="Repeticiones"
              controlId="repeticiones"
              register={register}
              value={exerciseDetails.repeticiones}
              onChange={e => setExerciseDetails({ ...exerciseDetails, repeticiones: e.target.value })}
            />
            <CustomFormInput
              label="Tiempo de Descanso (segundos)"
              controlId="tiempo_descanso"
              register={register}
              value={exerciseDetails.tiempo_descanso}
              onChange={e => setExerciseDetails({ ...exerciseDetails, tiempo_descanso: e.target.value })}
            />
            <CustomFormInput
              label="Explicación / Observaciones"
              controlId="explicacion"
              register={register}
              value={exerciseDetails.explicacion}
              onChange={e => setExerciseDetails({ ...exerciseDetails, explicacion: e.target.value })}
            />
            {(mode === 'A' || mode === 'M') && 
              <div className="d-flex justify-content-center gap-2">
                <Button onClick={addExerciseToRoutine}><FontAwesomeIcon icon={faPlus} /> Agregar Ejercicio</Button>
                <Button variant="success" onClick={handleCreateExercise}><FontAwesomeIcon icon={faPlus} /> Crear Ejercicio</Button>
              </div>
            }
            {/* Lista de ejercicios añadidos */}
            <Table striped bordered hover variant="dark" className="custom-border mt-3" responsive>
              <thead>
                <tr>
                  <th>Ejercicio</th>
                  <th>Series</th>
                  <th>Repeticiones</th>
                  <th>Descanso</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {routines?.ejercicios?.map((ejercicio, index) => (
                  <tr key={index}>
                    <td>{ejercicio.nombre}</td>
                    <td>{ejercicio.series}</td>
                    <td>{ejercicio.repeticiones}</td>
                    <td>{ejercicio.tiempo_descanso}</td>
                    <td>{ejercicio.explicacion}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            <CustomButtonsGroup 
              mode={mode} 
              isSubmitting={isLoading} 
              handleBack={handleBack} 
            />
          </Form>
        </>
      )}

      {/* Modo crear ejercicio */}
      {mode === 'E' && (
        <>
          <h3>Crear Ejercicio</h3>
          <ExerciseCreationForm 
            mode={mode}
            handleBack={handleBack} 
            onExerciseCreated={fetchExercises} 
          />
        </>
      )}

      {isLoading && <CustomSpinner />}
    </Container>
  );
};

export default RoutinesScreen;