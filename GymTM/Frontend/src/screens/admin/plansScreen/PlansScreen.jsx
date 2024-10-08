import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Container } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { getData, insertData, updateData } from '../../../services/dataService';
import toast from 'react-hot-toast';
import CustomSpinner from '../../../components/customSpinner/CustomSpinner';
import CustomFormInput from '../../../components/customFormInput/CustomFormInput';
import CustomFormSelect from '../../../components/customFormSelect/CustomFormSelect';
import ActionButtons from '../../../components/actionButtons/ActionButtons';
import CustomButtonsGroup from '../../../components/customButtonsGroup/CustomButtonsGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useIsMobile } from '../../../hooks/useIsMobile';

const PlansScreen = () => {
  const [mode, setMode] = useState('L'); // 'L'ist, 'A'dd, 'M'odify, 'C'onsult
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const initialFormState = {
    nombre: '',
    descripcion: '',
    metodo_pago: '',
    importe: '',
    fecha_alta: '',
    fecha_baja: '',
  };

  useEffect(() => {
    if (mode === 'L') {
      fetchPlans();
    }
  }, [mode]);

  // Obtener planes
  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const response = await getData('planes');
      setPlans(response);
      setFilteredPlans(response);
    } catch (error) {
      toast.error('Error al obtener planes.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar planes por nombre
  const handleSearch = (e) => {
    const nombre = e.target.value.toLowerCase();
    if (nombre) {
      const results = plans.filter(plan => plan.nombre.toLowerCase().includes(nombre));
      setFilteredPlans(results);
    } else {
      setFilteredPlans(plans);
    }
  };

  // Cambiar a modo Alta
  const handleAddPlan = () => {
    reset(initialFormState);
    setMode('A');
  };

  // Cambiar a modo Modificar
  const handleEdit = async (id) => {
    try {
      const plan = await getData(`planes/${id}`);
      reset(plan);
      setMode('M');
    } catch (error) {
      toast.error('Error al obtener el plan.');
    }
  };

  // Cambiar a modo Consultar
  const handleConsult = async (id) => {
    try {
      const plan = await getData(`planes/${id}`);
      reset(plan);
      setMode('C');
    } catch (error) {
      toast.error('Error al obtener el plan.');
    }
  };

  // Dar de baja/activar plan
  const handleToggleStatus = async (id) => {
    try {
      await updateData(`planes/toggleStatus`, { id });
      toast.success('Estado del plan actualizado exitosamente.');
      fetchPlans();
    } catch (error) {
      toast.error('Error al actualizar el estado del plan.');
    }
  };

  // Guardar plan (Alta o Modificar)
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
      toast.error('Error al guardar el plan.');
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
          <h3 className="text-center">Lista de Planes</h3>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Control
              className={`bg-obscure custom-border text-white w-35 ${isMobile && 'w-100 me-2'}`}
              type="text"
              placeholder="Buscar por nombre"
              onChange={handleSearch}
            />
            <Button variant="success" onClick={handleAddPlan}><FontAwesomeIcon icon={faPlus} /> {!isMobile && 'Agregar plan'}</Button>
          </div>
          <Table striped bordered hover variant="dark" className='m-0 custom-border' responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Método de Pago</th>
                <th>Importe</th>
                <th>Fecha Alta</th>
                <th>Fecha Baja</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans?.map(plan => (
                <tr key={plan.id}>
                  <td>{plan.nombre}</td>
                  <td>{plan.descripcion}</td>
                  <td>{plan.metodo_pago}</td>
                  <td>{plan.importe}</td>
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
            <CustomFormSelect
              label="Método de Pago"
              controlId="metodo_pago"
              register={register}
              errors={errors.metodo_pago}
              options={[
                { id: 'efectivo', name: 'Efectivo' },
                { id: 'transferencia', name: 'Transferencia' },
                { id: 'tarjetaDebito', name: 'Tarjeta de Débito' },
                { id: 'tarjetaCredito', name: 'Tarjeta de Crédito' },
                { id: 'debitoAutomatico', name: 'Débito Automático' },
              ]}
              option={mode}
            />
            <CustomFormInput
              label="Importe"
              controlId="importe"
              type="number"
              register={register}
              errors={errors.importe}
              option={mode}
            />
            <CustomFormInput
              label="Fecha de Alta"
              controlId="fecha_alta"
              type="date"
              register={register}
              errors={errors.fecha_alta}
              option={mode}
              required={false}
            />
            <CustomFormInput
              label="Fecha de Baja"
              controlId="fecha_baja"
              type="date"
              register={register}
              errors={errors.fecha_baja}
              option={mode}
              required={false}
            />

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