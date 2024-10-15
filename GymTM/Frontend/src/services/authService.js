import axios from 'axios';

const apiUrl = process.env.REACT_APP_URL_API;

// Método para iniciar sesión
export const login = async (documento, password) => {
  try {
    const url = `${apiUrl}/api/auth/login`;

    const response = await axios.post(url, { documento, password }, { withCredentials: true });

    if (response.status === 200) {
      const data = response.data;
      if (data && data.userData) {
        // Guardar los datos del usuario en el localStorage (ya no guardas el token)
        localStorage.setItem('userData', JSON.stringify(data.userData)); // Guardar los datos del usuario
        return { success: true };
      } else {
        return { success: false, message: 'Error en la autenticación.' };
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
export const logout = async () => {
  try {
    // Realizar una solicitud al backend para destruir la sesión/cookie
    await axios.post(`${apiUrl}/api/auth/logout`, {}, { withCredentials: true });

    localStorage.removeItem('userData'); // Elimina los datos del usuario del almacenamiento
  } catch (error) {
    console.error('Error al cerrar sesión:', error.message);
  }
};

// Método para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return !!localStorage.getItem('userData'); // Verifica si hay datos del usuario almacenados
};

// Método para obtener los datos del usuario logueado desde el localStorage
export const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null; // Retorna los datos del usuario o null si no existen
};

// Método para obtener el perfil del usuario logueado desde el backend
export const getLoggedUser = async () => {
  try {
    const url = `${apiUrl}/api/auth/user`;
    const response = await axios.get(url, { withCredentials: true });

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