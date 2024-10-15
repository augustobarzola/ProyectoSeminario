// import React from "react";
import React, { useState, useEffect } from "react";
import { getData, insertData } from "../../../services/dataService";
import { Table, Container, Row, Col } from "react-bootstrap";
import showErrorMessage from "../../../utils/showErrorMessage";
import "./DashboardScreen.css";
import { Chart } from "react-google-charts";

const DashboardScreen = () => {
  const data = [
    ["Periodo", "Asistencias"],
    ["Mañana", 30], // Asistencias en la mañana
    ["Tarde", 50], // Asistencias en la tarde
    ["Noche", 20], // Asistencias en la noche
  ];

  const options = {
    title: "Asistencias del Día",
    titleColor: "#ffffff",
    pieHole: 0.4, // Si prefieres un gráfico de dona
    is3D: false,
    colors: ["#3498db", "#1abc9c", "#e74c3c"], // Colores para cada sección
    backgroundColor: "#1c1d1f",
    legend: {
      position: "rig",
      textStyle: {
        color: "#ffffff", // Cambia el color del texto de la leyenda aquí
      },
    },
  };

  const [asistencias, setAsistencias] = useState([]); // Lista de asistencias
  const [isLoading, setIsLoading] = useState(false);

  // Función para obtener las últimas asistencias
  useEffect(() => {
    fetchLastAssists(); // Obtener asistencias al cargar el componente
  }, []);

  // Obtener asistencias
  const fetchLastAssists = async () => {
    setIsLoading(true);
    try {
      const response = await getData("asistencias"); // Cambiado a "asistencias/ultimas"
      setAsistencias(response); // Corregido a setAsistencias
    } catch (error) {
      showErrorMessage("Error al obtener asistencias", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <h3 className="text-center">DASHBOARD</h3>

      <Row className="mt-5">
        {/* Columna para el gráfico */}
        <Col md={6}>
          <h4 className="text-center">Asistencias De Hoy</h4>
          {/* Aquí se muestra el gráfico */}
          <div style={{ width: "100%" }}>
            <Chart
              chartType="PieChart"
              data={data}
              options={options}
              width="100%"
              height="350px"
            />
          </div>
        </Col>

        {/* Columna para la tabla */}
        <Col md={6}>
          <h4 className="text-center">Últimas Asistencias</h4>
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
                <th>Nombre del Cliente</th>
                <th>Fecha de Ingreso</th>
              </tr>
            </thead>
            <tbody>
              {asistencias.slice(0 - 10).map((assist) => (
                <tr key={assist.id_asistencia}>
                  <td>{assist.documento}</td>
                  <td>{assist.nombre_cliente}</td>
                  <td>{assist.fecha_ingreso}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardScreen;
