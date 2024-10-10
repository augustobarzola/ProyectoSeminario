import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Container } from 'react-bootstrap';
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
import { calcularEdad } from '../../../utils/helper';
import { getUserData } from '../../../services/authService';
import { useIsMobile } from '../../../hooks/useIsMobile';
import showErrorMessage from '../../../utils/showErrorMessage';

const ClientsScreen = () => {
  const [mode, setMode] = useState('L'); // Modo inicial: Lista
  const [clients, setClients] = useState([]); // Lista de clientes
  const [filteredClients, setFilteredClients] = useState([]); // Clientes filtrados por búsqueda
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const isMobile = useIsMobile();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const initialFormState = {
    nombre: '',
    apellido: '',
    dni: '',
    sexo: '',
    correo: '',
    telefono: '',
    calle: '',
    numero: '',
    pais: '',
    provincia: '',
    ciudad: '',
    codigo_postal: ''
  };

  useEffect(() => {
    const data = getUserData();
    setUser(data);
  }, []);

  useEffect(() => {
    if (mode === 'L') {
      fetchClients();
    }
  }, [mode]);

  // Obtener clientes
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await getData('clientes');
      setClients(response);
      setFilteredClients(response);
    } catch (error) {
      showErrorMessage('Error al obtener clientes', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar clientes por Documento
  const handleSearch = (e) => {
    const dni = e.target.value;
    if (dni) {
      const results = clients.filter(client => client.dni.includes(dni));
      setFilteredClients(results);
    } else {
      setFilteredClients(clients);
    }
  };

  // Cambiar a modo Alta
  const handleAdd = () => {
    reset(initialFormState); // Limpiar formulario
    setMode('A');
  };

  // Cambiar a modo Modificar con cliente seleccionado
  const handleEdit = async (id) => {
    const cliente = await getData(`clientes/${id}`);
    reset(cliente);
    setMode('M');
  };

  // Cambiar a modo Consultar
  const handleConsult = async (id) => {
    const cliente = await getData(`clientes/${id}`);
    reset(cliente);
    setMode('C');
  };

  // Dar de baja/activar cliente
  const handleToggleStatus = async (id) => {
    try {
      await updateData('clientes/toggleStatus', { id: id });

      toast.success("Estado del cliente actualizado exitosamente!");

      fetchClients();
      handleBack();
    } catch (error) {
      showErrorMessage('Hubo un error al actualizar el estado del cliente', error);
    }
  };

  // Guardar cliente (Alta o Modificar)
  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      if (mode === 'A') {
        await insertData('clientes', { body: data });
        toast.success('Cliente creado exitosamente');
      } else if (mode === 'M') {
        await updateData('clientes', { id: data.id_usuario, body: data });
        toast.success('Cliente actualizado exitosamente');
      }

      handleBack();
    } catch (error) {
      showErrorMessage('Error al guardar cliente', error);
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
          <h3 className="text-center">Lista de Clientes y Asignacion de Planes de Pago</h3>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Control className={`bg-obscure custom-border text-white w-35 ${isMobile && 'w-100 me-2'}`} type="text" placeholder="Buscar " onChange={handleSearch} />
            {(user?.id_rol === 1 || user?.id_rol === 2) && <Button variant="success" onClick={handleAdd}><FontAwesomeIcon icon={faPlus} /> {!isMobile && 'Agregar cliente'}</Button>}
          </div>
          <Table striped bordered hover variant="dark" className='m-0 custom-border' responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Sexo</th>
                <th>Edad</th>
                <th>Plan Pago</th>
                <th>Fecha Alta</th>
                <th>Fecha Baja</th>
                <th className="">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients?.map(client => (
                <tr key={client.id}>
                  <td>{client.nombre}, {client.apellido}</td>
                  <td>{client.dni}</td>
                  <td>{client.sexo}</td>
                  <td>{calcularEdad(client.fecha_nacimiento)}</td>
                  <td>{client.plan}</td>
                  <td>{client.fecha_alta}</td>
                  <td>{client.fecha_baja}</td>
                  <td className="col-1 text-center">
                    <ActionButtons 
                      handleConsult={handleConsult} 
                      handleEdit={handleEdit} 
                      handleToggleStatus={handleToggleStatus} 
                      item={client} 
                      buttonVisibility = {{
                        consult: true,
                        edit: user?.id_rol === 1 || user?.id_rol === 2, // Solo mostrar si el rol es 1 o 2
                        toggleStatus: user?.id_rol === 1 || user?.id_rol === 2, // Solo mostrar si el rol es 1 o 2
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
            {mode === 'A' ? 'Alta de Cliente' : mode === 'M' ? 'Modificar Cliente' : 'Consultar Cliente'}
          </h3>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Sección Datos del Cliente */}
            <h4 className="text-center">Datos del Cliente</h4>
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
              controlId="dni"
              register={register}
              errors={errors.dni}
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

            {/* Sección Domicilio del Cliente */}
            <h4 className="text-center">Domicilio del Cliente</h4>
            <CustomFormInput
              label="Calle"
              controlId="calle"
              register={register}
              errors={errors.calle}
              option={mode}
              required={false}
            />
            <CustomFormInput
              label="Número"
              controlId="numero"
              register={register}
              errors={errors.numero}
              option={mode}
              required={false}
            />
            <CustomFormSelect
              label="Pais"
              controlId="pais"
              register={register}
              errors={errors.pais}
              options={[
                { id: 1, name: 'Argentina' },
                { id: 2, name: 'Extranjero' },
              ]}
              option={mode}
              required={false}
            />
            <CustomFormSelect
              label="Provincia"
              controlId="provincia"
              register={register}
              errors={errors.provincia}
              options={[
                { id: 1, name: 'Buenos Aires' },
                { id: 2, name: 'Córdoba' },
                { id: 3, name: 'Santa Fe' },
              ]}
              option={mode}
              required={false}
            />
            <CustomFormInput
              label="Ciudad"
              controlId="ciudad"
              register={register}
              errors={errors.ciudad}
              option={mode}
              required={false}
            />
            <CustomFormInput
              label="Código Postal"
              controlId="codigo_postal"
              register={register}
              errors={errors.codigo_postal}
              option={mode}
              required={false}
            />

            {/* Sección Plan Pago del Cliente */}
            <h4 className="text-center">Plan de Pago</h4>
            <CustomFormSelect
              label="Plan"
              controlId="plan"
              register={register}
              errors={errors.plan}
              options={[
                { id: 1, name: 'Mensual' },
                { id: 2, name: 'Trimestral' },
                { id: 3, name: 'Semestral' },
              ]}
              option={mode}
              required={false}
            />
            <CustomFormSelect
              label="Metodo de Pago"
              controlId="metodoDePago"
              register={register}
              errors={errors.metodoDePago}
              options={[
                { id: 1, name: 'Efectivo' },
                { id: 2, name: 'Tarjeta' },
                { id: 3, name: 'Debito' },
              ]}
              option={mode}
              required={false}
            />
            <CustomFormInput
              label="Importe"
              controlId="importe"
              register={register}
              errors={errors.importe}
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

export default ClientsScreen;