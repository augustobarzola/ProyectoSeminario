import React from "react";
import "./DashboardScreen.css";
import { Container } from "react-bootstrap";
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

  return (
    <Container fluid className="py-4">
      <h3 className="text-center">DASHBOARD</h3>

      {/* Aquí se muestra el gráfico */}
      <div style={{ width: "900px", margin: "0", paddingTop: "60px" }}>
        <Chart
          chartType="PieChart"
          data={data}
          options={options}
          width="600px"
          height="350px"
        />
      </div>
    </Container>
  );
};

export default DashboardScreen;
