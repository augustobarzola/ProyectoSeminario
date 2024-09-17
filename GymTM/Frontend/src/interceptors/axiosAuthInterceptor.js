import axios from 'axios';
import { getToken } from '../services/authService'; // Asegúrate de que la ruta sea correcta

// Función para configurar el interceptor
const setupAxiosAuthInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        // Añadir el token en el encabezado Authorization si existe
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      // Manejar errores de la solicitud
      return Promise.reject(error);
    }
  );
};

export default setupAxiosAuthInterceptors;