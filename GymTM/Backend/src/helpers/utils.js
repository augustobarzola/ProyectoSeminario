// Función para convertir dd/mm/yyyy a yyyy-mm-dd
const convertToISODate = (date) => {
  if (!date || typeof date !== 'string') return date; // Si no es un string, retornamos el valor sin cambiar
  const [day, month, year] = date.split('/');
  console.log(year+"-"+month+"-"+day);
  return `${year}-${month}-${day}`;
};

// Función para convertir yyyy-mm-dd a dd/mm/yyyy
const convertToDisplayDate = (date) => {
  if (!date || !(date instanceof Date)) return date; // Verificar que la fecha sea válida
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Función para convertir yyyy-mm-dd a dd/mm/yyyy hh:mm:ss
const convertToDisplayDateTime = (date) => {
  if (!date || !(date instanceof Date)) return date; // Verificar que la fecha sea válida
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

module.exports = { convertToISODate, convertToDisplayDate, convertToDisplayDateTime };