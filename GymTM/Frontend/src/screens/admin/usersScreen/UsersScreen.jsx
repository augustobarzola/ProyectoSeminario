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
import { useIsMobile } from '../../../hooks/useIsMobile';

const UsersScreen = () => {
  const [mode, setMode] = useState('L'); // Modo inicial: Lista
  const [users, setUsers] = useState([]); // Lista de usuarios
  const [filteredUsers, setFilteredUsers] = useState([]); // Usuarios filtrados por búsqueda
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const isMobile = useIsMobile();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const initialFormState = {
    nombre: '',
    apellido: '',
    dni: '',
    sexo: '',
    correo: '',
    telefono: '',
    id_rol: ''
  };

  useEffect(() => {
    if (mode === 'L') {
      fetchUsers();
    } else {
      fetchRoles();
    }
  }, [mode]);

  // Obtener usuarios
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getData('usuarios');
      setUsers(response);
      setFilteredUsers(response);
    } catch (error) {
      toast.error('Error al obtener usuarios.');
    } finally {
      setIsLoading(false);
    }
  };

    // Obtener usuarios
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const response = await getData('roles');
        
        setRoles(response?.filter((e) => e.id === 1 || e.id === 2 | e.id === 3)); // Solamente admin o recepcionista, ya que cliente y entrenador tienen sus pantallas
      } catch (error) {
        toast.error('Error al obtener roles.');
      } finally {
        setIsLoading(false);
      }
    };

  // Filtrar usuarios por DNI
  const handleSearch = (e) => {
    const dni = e.target.value;
    if (dni) {
      const results = users.filter(user => user.dni.includes(dni));
      setFilteredUsers(results);
    } else {
      setFilteredUsers(users);
    }
  };

  // Cambiar a modo Alta
  const handleAdd = () => {
    reset(initialFormState); // Limpiar formulario
    setMode('A');
  };

  // Cambiar a modo Consultar con usuario seleccionado
  const handleConsult = async (id) => {
    const usuario = await getData(`usuarios/${id}`);
    reset(usuario);
    setMode('C');
  };

  // Cambiar a modo Modificar con usuario seleccionado
  const handleEdit = async (id) => {
    const usuario = await getData(`usuarios/${id}`);
    reset(usuario);
    setMode('M');
  };

  // Dar de baja/activar usuario
  const handleToggleStatus = async (id) => {
    try {
      await updateData('usuarios/toggleStatus', { id });
      toast.success("Estado del usuario actualizado exitosamente!");
      fetchUsers();
    } catch (error) {
      toast.error('Hubo un error al actualizar el estado del usuario.');
    }
  };

  // Guardar usuario (Alta o Modificar)
  const onSubmit = async (data) => {
    setIsLoading(true);
  
    try {
      if (mode === 'A') {
        await insertData('usuarios', { body: data });
        toast.success('Usuario creado exitosamente');
      } else if (mode === 'M') {
        await updateData('usuarios', { id: data.id, body: data });
        toast.success('Usuario actualizado exitosamente');
      }
      handleBack();
    } catch (error) {
      let mensaje = error.response?.data?.message?.toLowerCase().includes('dni') ? error.response?.data?.message : '';
      toast.error('Error al guardar usuario. ' + mensaje);
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
          <h3 className="text-center">Lista de Usuarios</h3>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Control className={`bg-obscure custom-border text-white w-35 ${isMobile && 'w-100 me-2'}`} type="text" placeholder="Buscar por DNI" onChange={handleSearch} />
            <Button variant="success" onClick={handleAdd}><FontAwesomeIcon icon={faPlus} /> {!isMobile && 'Agregar usuario'}</Button>
          </div>
          <Table striped bordered hover variant="dark" className='m-0 custom-border' responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Fecha Alta</th>
                <th>Fecha Baja</th>
                <th className="">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers?.map(user => (
                <tr key={user.id}>
                  <td>{user.nombre} {user.apellido}</td>
                  <td>{user.dni}</td>
                  <td>{user.correo}</td>
                  <td>{user.rol}</td>
                  <td>{user.fecha_alta}</td>
                  <td>{user.fecha_baja}</td>
                  <td className="col-1 text-center">
                    <ActionButtons 
                      handleConsult={handleConsult} 
                      handleEdit={handleEdit} 
                      handleToggleStatus={handleToggleStatus} 
                      item={user} 
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
          {mode === 'A' ? 'Alta de Usuario' : mode === 'M' ? 'Modificar Usuario' : 'Consultar Usuario'}
          </h3>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Sección Datos del Usuario */}
            <h4 className="text-center">Datos del Usuario</h4>
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
              label="DNI"
              controlId="dni"
              register={register}
              errors={errors.dni}
              option={mode}
              disabled={mode === 'M'}
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
            <CustomFormSelect
              label="Rol"
              controlId="id_rol"
              register={register}
              errors={errors.id_rol}
              options={roles}
              option={mode}
              valueReturn="id"
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

export default UsersScreen;