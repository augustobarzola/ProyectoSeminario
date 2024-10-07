export const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return null;

  // Dividimos la fecha de nacimiento (dd/mm/yyyy)
  const [dia, mes, anio] = fechaNacimiento.split('/').map(Number);

  // Obtenemos la fecha actual
  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  const mesActual = fechaActual.getMonth() + 1; // Los meses en JavaScript son de 0 a 11
  const diaActual = fechaActual.getDate();

  // Calculamos la edad
  let edad = anioActual - anio;

  // Si aún no ha pasado el cumpleaños este año, restamos 1
  if (mesActual < mes || (mesActual === mes && diaActual < dia)) {
      edad--;
  }

  return edad;
}