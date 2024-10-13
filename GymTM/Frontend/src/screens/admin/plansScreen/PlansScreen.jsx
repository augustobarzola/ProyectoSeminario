import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Container, Accordion } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { getData, insertData, updateData } from '../../../services/dataService';
import toast from 'react-hot-toast';
import CustomSpinner from '../../../components/customSpinner/CustomSpinner';
import CustomFormInput from '../../../components/customFormInput/CustomFormInput';
import CustomButtonsGroup from '../../../components/customButtonsGroup/CustomButtonsGroup';
import ActionButtons from '../../../components/actionButtons/ActionButtons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useIsMobile } from '../../../hooks/useIsMobile';
import showErrorMessage from '../../../utils/showErrorMessage';
import { getUserData } from '../../../services/authService';

const PlansScreen = () => {
  const [mode, setMode] = useState('L');
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activePlanId, setActivePlanId] = useState(null); // Para manejar la subtabla
  const isMobile = useIsMobile();
  const [user, setUser] = useState(null);

  const initialFormState = {
    nombre: '',
    descripcion: '',
    metodo_pago: '',
    importe: '',
    fecha_alta: '',
    fecha_baja: '',
  };

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const data = getUserData();
    setUser(data);
  }, []);

  useEffect(() => {
    if (mode === 'L') {
      fetchPlans();
    }
  }, [mode]);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const response = await getData('planes');
      setPlans(response);
      setFilteredPlans(response);
    } catch (error) {
      showErrorMessage('Error al obtener los planes', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const nombre = e.target.value.toLowerCase();
    const results = nombre 
      ? plans.filter(plan => plan.nombre.toLowerCase().includes(nombre)) 
      : plans;
    setFilteredPlans(results);
  };

  const handleAddPlan = () => {
    reset(initialFormState);
    setMode('A');
  };

  const handleEdit = async (id) => {
    try {
      const plan = await getData(`planes/${id}`);
      reset(plan);
      setMode('M');
    } catch (error) {
      showErrorMessage('Error al obtener el plan', error);
    }
  };

  const handleConsult = async (id) => {
    try {
      const plan = await getData(`planes/${id}`);
      reset(plan);
      setMode('C');
    } catch (error) {
      showErrorMessage('Error al obtener el plan', error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await updateData(`planes/toggleStatus`, { id });
      toast.success('Estado del plan actualizado exitosamente.');
      fetchPlans();
    } catch (error) {
      showErrorMessage('Error al actualizar el estado del plan', error);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (mode === 'A') {
        await insertData('planes', { body: data });
        toast.success('Plan creado exitosamente.');
      } else if (mode === 'M') {
        await updateData('planes', { id: data.id, body: data });
        toast.success('Plan actualizado exitosamente.');
      }
      handleBack();
    } catch (error) {
      showErrorMessage('Error al guardar el plan', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setMode('L');
    reset(initialFormState);
  };

  // Manejar la visualización de la subtabla
  const toggleSubTable = (id) => {
    setActivePlanId(activePlanId === id ? null : id);
  };

  return (
    <Container fluid className="py-4">
      {mode === 'L' && (
        <>
          <h3 className="text-center">Lista de Planes de Pago</h3>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Control
              className={`bg-obscure custom-border text-white w-35 ${isMobile && 'w-100 me-2'}`}
              type="text"
              placeholder="Buscar por nombre"
              onChange={handleSearch}
            />
            {user?.id_rol === 1 && <Button variant="success" onClick={handleAdd}><FontAwesomeIcon icon={faPlus} /> {!isMobile && 'Agregar plan'}</Button>}
          </div>
          <Table striped bordered hover variant="dark" className='m-0 custom-border' responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Fecha Alta</th>
                <th>Fecha Baja</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map(plan => (
                <React.Fragment key={plan.id}>
                  <tr>
                    <td>{plan.nombre}</td>
                    <td>{plan.descripcion}</td>
                    <td>{plan.fecha_alta}</td>
                    <td>{plan.fecha_baja}</td>
                    <td className="col-1 text-center">
                      <ActionButtons 
                        handleConsult={handleConsult} 
                        handleEdit={handleEdit} 
                        handleToggleStatus={handleToggleStatus} 
                        item={plan} 
                      />
                    </td>
                  </tr>
                    <tr>
                      <td colSpan="5">
                        <Table striped bordered hover variant="info" className='m-0 custom-border' responsive>
                          <thead>
                            <tr>
                              <th>Método de Pago</th>
                              <th>Importe</th>
                              <th>Fecha Alta</th>
                              <th>Fecha Baja</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {plan.metodos_pago.map(metodo => (
                              <tr key={metodo.id}>
                                <td>{metodo.nombre}</td>
                                <td>$ {metodo.precio}</td>
                                <td>{plan.fecha_alta}</td>
                                <td>{plan.fecha_baja}</td>
                                <td className="col-1 text-center">
                                  <ActionButtons 
                                    handleConsult={handleConsult} 
                                    handleEdit={handleEdit} 
                                    handleToggleStatus={handleToggleStatus} 
                                    item={metodo} 
                                    buttonVisibility = {{
                                      consult: false,
                                      edit: true,
                                      toggleStatus: true,
                                    }}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </td>
                    </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {(mode === 'A' || mode === 'M' || mode === 'C') && (
        <>
          <h3>
            {mode === 'A' ? 'Alta de Plan' : mode === 'M' ? 'Modificar Plan' : 'Consultar Plan'}
          </h3>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <CustomFormInput
              label="Nombre"
              controlId="nombre"
              register={register}
              errors={errors.nombre}
              option={mode}
            />
            <CustomFormInput
              label="Descripción"
              controlId="descripcion"
              register={register}
              errors={errors.descripcion}
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

export default PlansScreen;