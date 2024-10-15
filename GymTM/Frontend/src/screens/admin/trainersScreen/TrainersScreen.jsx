import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Container } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { getData, insertData, updateData, deleteData } from '../../../services/dataService';
import toast from 'react-hot-toast';
import CustomSpinner from '../../../components/customSpinner/CustomSpinner';
import CustomFormInput from '../../../components/customFormInput/CustomFormInput';
import CustomFormSelect from '../../../components/customFormSelect/CustomFormSelect';
import ActionButtons from '../../../components/actionButtons/ActionButtons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import CustomButtonsGroup from '../../../components/customButtonsGroup/CustomButtonsGroup';
import CustomDateTimePicker from '../../../components/customDateTimePicker/CustomDateTimePicker';
import { getUserData } from '../../../services/authService';
import { useIsMobile } from '../../../hooks/useIsMobile';
import showErrorMessage from '../../../utils/showErrorMessage';

const TrainersScreen = () => {
  const [mode, setMode] = useState('L'); // Modo inicial: Lista
  const [trainers, setTrainers] = useState([]); // Lista de entrenadores
  const [filteredTrainers, setFilteredTrainers] = useState([]); // Entrenadores filtrados por búsqueda
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const isMobile = useIsMobile();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const initialFormState = {
    nombre: '',
    apellido: '',
    documento: '',
    sexo: '',
    correo: '',
    telefono: '',
    especialidad: '',
    fecha_nacimiento: ''
  };

  useEffect(() => {
    const data = getUserData();
    setUser(data);
  }, []);

  useEffect(() => {
    if (mode === 'L') {
      fetchTrainers();
    }
  }, [mode]);

  // Obtener entrenadores
  const fetchTrainers = async () => {
    setIsLoading(true);
    try {
      const response = await getData('entrenadores');
      setTrainers(response);
      setFilteredTrainers(response);
    } catch (error) {
      showErrorMessage('Error al obtener entrenadores', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar entrenadores por Documento o Nombre
  const handleSearch = (e) => {
    const text = e.target.value;
    if (text) {
      const results = trainers.filter(trainer => trainer.documento.includes(text) || trainer.apellido.includes(text) || trainer.nombre.includes(text));
      setFilteredTrainers(results);
    } else {
      setFilteredTrainers(trainers);
    }
  };

  // Cambiar a modo Alta
  const handleAdd = () => {
    reset(initialFormState); // Limpiar formulario
    setMode('A');
  };

  // Cambiar a modo Modificar con entrenador seleccionado
  const handleEdit = async (id) => {
    const trainer = await getData(`entrenadores/${id}`);
    reset(trainer);
    setMode('M');
  };

  // Cambiar a modo Consultar
  const handleConsult = async (id) => {
    const trainer = await getData(`entrenadores/${id}`);
    reset(trainer);
    setMode('C');
  };

  // Dar de baja/activar entrenador
  const handleToggleStatus = async (id) => {
    try {
      await updateData('entrenadores/toggleStatus', { id: id });

      toast.success("Estado del entrenador actualizado exitosamente!");

      fetchTrainers();
      handleBack();
    } catch (error) {
      showErrorMessage('Hubo un error al actualizar el estado del entrenador', error);
    }
  };

  // Guardar entrenador (Alta o Modificar)
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (mode === 'A') {
        await insertData('entrenadores', { body: data });
        toast.success('Entrenador creado exitosamente');
      } else if (mode === 'M') {
        await updateData('entrenadores', { id: data.id, body: data });
        toast.success('Entrenador actualizado exitosamente');
      }
      handleBack();
    } catch (error) {
      showErrorMessage('Error al guardar entrenador', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setMode('L');
    reset(initialFormState);
  };

  return (
    <Container fluid className="py-4">
      {mode === 'L' && (
        <>
          <h3 className="text-center">Lista de Entrenadores</h3>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Control className={`bg-obscure custom-border text-white w-35 ${isMobile && 'w-100 me-2'}`} type="text" placeholder="Buscar por Documento/Nombre" onChange={handleSearch} />
            {user?.id_rol === 1 && <Button variant="success" onClick={handleAdd}><FontAwesomeIcon icon={faPlus} /> {!isMobile && 'Agregar entrenador'}</Button>}
          </div>
          <Table striped bordered hover variant="dark" className='m-0 custom-border' responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Sexo</th>
                <th>Especialidades</th>
                <th>Fecha de Nacimiento</th>
                <th>Fecha Alta</th>
                <th>Fecha Baja</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrainers?.map(trainer => (
                <tr key={trainer.id}>
                  <td>{trainer.apellido}, {trainer.nombre}</td>
                  <td>{trainer.documento}</td>
                  <td>{trainer.sexo}</td>
                  <td>{trainer.especialidad}</td>
                  <td>{trainer.fecha_nacimiento}</td>
                  <td>{trainer.fecha_alta}</td>
                  <td>{trainer.fecha_baja}</td>
                  <td className="col-1 text-center">
                    <ActionButtons 
                      handleConsult={handleConsult} 
                      handleEdit={handleEdit} 
                      handleToggleStatus={handleToggleStatus}
                      item={trainer} 
                      buttonVisibility = {{
                        consult: true,
                        edit: user?.id_rol === 1, // Solo mostrar si el rol es 1
                        toggleStatus: user?.id_rol === 1, // Solo mostrar si el rol es 1
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {(mode !== 'L') && (
        <>
          <h3>
            {mode === 'A' ? 'Alta de Entrenador' : mode === 'M' ? 'Modificar Entrenador' : 'Consultar Entrenador'}
          </h3>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Sección Datos del Entrenador */}
            <h4 className="text-center">Datos del Entrenador</h4>
            <CustomFormInput
              label="Nombre"
              controlId="nombre"
              register={register}
              errors={errors.nombre}
              option={mode}
            />
            <CustomFormInput
              label="Apellido"
              controlId="apellido"
              register={register}
              errors={errors.apellido}
              option={mode}
            />
            <CustomFormInput
              label="Documento"
              controlId="documento"
              register={register}
              errors={errors.documento}
              option={mode}
              disabled={mode === 'C' || mode === 'M'}
            />
            <CustomFormSelect
              label="Sexo"
              controlId="sexo"
              register={register}
              errors={errors.sexo}
              options={[
                { id: 1, name: 'Masculino' },
                { id: 2, name: 'Femenino' },
                { id: 3, name: 'Otro' },
              ]}
              option={mode}
            />
            <CustomDateTimePicker
              label="Fecha de Nacimiento"
              controlId="fecha_nacimiento"
              register={register}
              errors={errors.fecha_nacimiento}
              option={mode}
            />
            <CustomFormInput
              label="Correo"
              controlId="correo"
              type="email"
              register={register}
              errors={errors.correo}
              option={mode}
              required={false}
            />
            <CustomFormInput
              label="Teléfono"
              controlId="telefono"
              register={register}
              errors={errors.telefono}
              option={mode}
              required={false}
            />
            
            <CustomFormInput
              label="Especialidad"
              controlId="especialidad"
              register={register}
              errors={errors.especialidad}
              option={mode}
              required={false}
            />

            {mode !== 'A' && (
              <>
                <CustomFormInput
                  label="Fecha de Alta"
                  controlId="fecha_alta"
                  register={register}
                  errors={register.fecha_alta}
                  mode={mode}
                  disabled={true}
                  required={false}
                  extra={<i className="fa-solid fa-calendar-days"></i>}
                />

                <CustomFormInput
                  label="Fecha de Baja"
                  controlId="fecha_baja"
                  register={register}
                  errors={register.fecha_baja}
                  mode={mode}
                  disabled={true}
                  required={false}
                  extra={<i className="fa-solid fa-calendar-days"></i>}
                />      
              </>
            )}     

            <CustomButtonsGroup 
              mode={mode} 
              isSubmitting={isLoading} 
              handleBack={handleBack} 
            />
          </Form>
        </>
      )}

      {isLoading && <CustomSpinner />}
    </Container>
  );
};

export default TrainersScreen;