import axios from 'axios';

const apiUrl = "http://localhost:8300";

// Método para iniciar sesión
export const login = async (dni, password) => {
  try {
    const url = `${apiUrl}/api/auth/login`;

    const response = await axios.post(url, { dni, password });

    if (response.status === 200) {
      const data = response.data;
      if (data && data.token) {
        // Guardar el token y los datos del usuario en el localStorage
        localStorage.setItem('token', data.token); // Guardar el token JWT
        localStorage.setItem('userData', JSON.stringify(data.userData)); // Guardar los datos del usuario

        return { success: true };
      } else {
        return { success: false, message: 'Token no recibido.' };
      }
    } else {
      return { success: false, message: 'Error al iniciar sesión. La respuesta no fue exitosa.' };
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    return { success: false, message: error.response?.data?.message || 'Error al iniciar sesión' };
  }
};

// Método para cerrar sesión
export const logout = () => {
  localStorage.removeItem('token'); // Elimina el token del almacenamiento
  localStorage.removeItem('userData'); // Elimina los datos del usuario del almacenamiento
};

// Método para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return !!localStorage.getItem('token'); // Retorna true si hay un token
};

// Método para obtener el token almacenado
export const getToken = () => {
  return localStorage.getItem('token');
};

// Método para obtener los datos del usuario logueado desde el localStorage
export const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null; // Retorna los datos del usuario o null si no existen
};

// Configura un interceptor de Axios para añadir el token a las peticiones
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Método para obtener el perfil del usuario logueado desde el backend (opcional)
export const getLoggedUser = async () => {
  try {
    const url = `${apiUrl}/api/auth/user`; // Ruta para obtener el perfil del usuario
    const response = await axios.get(url);

    if (response.status === 200) {
      return response.data; // Retorna los datos del usuario desde el backend
    } else {
      throw new Error('No se pudo obtener el usuario.');
    }
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error.message);
    throw error;
  }
};