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
        const roles = data.userData.roles;

        if (roles && roles.length === 1) {
          // Si tiene un solo rol, seleccionarlo automáticamente
          localStorage.setItem('selectedRole', JSON.stringify(roles[0]));
        }

        localStorage.setItem('userData', JSON.stringify(data.userData)); // Guardar los datos del usuario

        return { success: true, userData: data.userData };
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

    localStorage.removeItem('selectedRole');
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
  const selectedRole = localStorage.getItem('selectedRole');
  
  if (!userData) {
    return null; // Retorna null si no hay datos del usuario
  }

  const parsedUserData = JSON.parse(userData); // Los datos del usuario

  // Si hay un rol seleccionado, agrega sus propiedades; de lo contrario, solo retorna los datos del usuario
  if (selectedRole) {
    const parsedSelectedRole = JSON.parse(selectedRole);
    return {
      ...parsedUserData,
      id_rol: parsedSelectedRole.id, // Solo el rol seleccionado
      rol: parsedSelectedRole.nombre, // Solo el rol seleccionado
    };
  }

  return parsedUserData; // Retorna solo los datos del usuario si no hay rol seleccionado
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

// Método para actualizar el perfil del usuario logueado
export const setSelectedRole = (role) => {
  if (role) {
    localStorage.setItem('selectedRole', JSON.stringify(role));
  }
};