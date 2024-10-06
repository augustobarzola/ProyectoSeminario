import toast from 'react-hot-toast';
import axios from 'axios';

const setupAxiosAuthInterceptors = () => {
  // Interceptor para solicitudes
  axios.interceptors.request.use(
    (config) => {
      // Configurar para enviar las cookies en cada solicitud
      config.withCredentials = true;
      return config;
    },
    (error) => {
      // Manejar errores en la solicitud
      return Promise.reject(error);
    }
  );

  // Interceptor para respuestas
  axios.interceptors.response.use(
    (response) => {
      // Simplemente retorna la respuesta si es exitosa
      return response;
    },
    async (error) => {
      if (error.response && error.response.status === 401) {
        // Verifica si el error es de token expirado (puedes ajustar esto según tu lógica)
        if (error.response.data && error.response.data.message.toLowerCase().includes('token')) {
          console.error('Token expirado. Redirigiendo al login.');
          
          // Mostrar el toast de alerta
          toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');

          // Limpiar el estado del usuario o cualquier sesión
          localStorage.removeItem('userData');

          // Redirigir al login después de un pequeño retraso para que el usuario vea el mensaje
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000); // Ajusta el tiempo de espera según sea necesario
        }
      }

      return Promise.reject(error);
    }
  );
};

export default setupAxiosAuthInterceptors;