import React, { useState, useEffect } from "react";
import { Table, Button, Form, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { deleteData, getData, insertData } from "../../../services/dataService";
import toast from "react-hot-toast";
import CustomSpinner from "../../../components/customSpinner/CustomSpinner";
import CustomFormInput from "../../../components/customFormInput/CustomFormInput";
import ActionButtons from "../../../components/actionButtons/ActionButtons";
import showErrorMessage from "../../../utils/showErrorMessage";
import { useConfirmationModal } from "../../../components/confirmationModalProvider/ConfirmationModalProvider";

const AsistenciasScreen = () => {
  const [asistencias, setAsistencias] = useState([]); // Lista de asistencias
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const initialFormState = { dni: "" }; // Formulario solo para ingresar el Documento del cliente

  useEffect(() => {
    fetchAsistencias(); // Obtener asistencias al cargar el componente
  }, []);

  // Obtener asistencias
  const fetchAsistencias = async () => {
    setIsLoading(true);
    try {
      const response = await getData("asistencias");
      setAsistencias(response);
    } catch (error) {
      showErrorMessage("Error al obtener asistencias", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Registrar asistencia del cliente
  const onSubmit = async (data) => {
    try {
      await insertData("asistencias", { body: data });
      toast.success("Asistencia registrada exitosamente");
      fetchAsistencias(); // Refrescar la lista de asistencias
      reset(initialFormState);
    } catch (error) {
      showErrorMessage("Error al registrar la asistencia", error);
    }
  };

  const handleDelete = async (id) => {
    //useConfirmationModal();
    try {
      await deleteData("asistencias", id);
      toast.success("Asistencia eliminada exitosamente");
      fetchAsistencias(); // Refrescar la lista de asistencias
      reset(initialFormState);
    } catch (error) {
      showErrorMessage("Error al eliminar la asistencia", error);
    }
  };

  return (
    <Container fluid className="py-4">
      <h3 className="text-center">Registro de Asistencias</h3>

      <Form onSubmit={handleSubmit(onSubmit)} className="mb-3">
        <CustomFormInput
          label="Documento del Cliente"
          controlId="dni"
          register={register}
          errors={errors.dni}
          option="A"
          required
        />
        <div className="d-flex justify-content-center">
          <Button type="submit" variant="success">
            Registrar Asistencia
          </Button>
        </div>
      </Form>

      <h3 className="text-center">Lista de Asistencias</h3>

      <Table
        striped
        bordered
        hover
        variant="dark"
        className="m-0 custom-border"
        responsive
      >
        <thead>
          <tr>
            <th>Documento</th>
            <th>Cliente</th>
            <th>Recepcionista</th>
            <th>Fecha Ingreso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.map((asistencia) => {
            return (
              <tr key={asistencia.id_asistencia}>
                <td>{asistencia?.dni}</td>
                <td>{asistencia?.nombre_cliente}</td>
                <td>{asistencia?.nombre_recepcionista}</td>
                <td>{asistencia?.fecha_ingreso}</td>
                <td className="col-1 text-center">
                  <ActionButtons
                    handleDelete={handleDelete}
                    item={{ ...asistencia, id: asistencia.id_asistencia }}
                    buttonVisibility={{
                      consult: false,
                      edit: false,
                      toggleStatus: false,
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {isLoading && <CustomSpinner />}
    </Container>
  );
};

export default AsistenciasScreen;
