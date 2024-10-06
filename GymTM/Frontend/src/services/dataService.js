import axios from 'axios';

const apiUrl = process.env.REACT_APP_URL_API;

export const getData = async (urlName, params) => {
  try {
    let url = `${apiUrl}/api/${urlName}`;
    const response = await axios.get(url, { params });

    if (response.status !== 200) {
      // Manejo de error en caso de respuesta no exitosa (por ejemplo, 404 o 500)
      throw new Error('Error al obtener los datos. La respuesta no fue exitosa.');
    }

    const data = response.data;

    if (data && data.error) {
      // Manejo de error si la respuesta contiene un campo de error
      throw new Error(`Error en la respuesta de la API: ${data.error}`);
    }

    return data;
  } catch (error) {
    console.error('Error al obtener los datos.');
    // Aquí podrías manejar la notificación de error al usuario, por ejemplo, mostrar un mensaje en la interfaz
    throw error; // Re-lanzar el error para que el componente que llama a esta función también pueda manejarlo
  }
};

export const getDataByName = async (urlName, name) => {
  try {
    let url = `${apiUrl}/api/${urlName}/${name}`;

    const response = await axios.get(url);

    if (response.status !== 200) {
      // Manejo de error en caso de respuesta no exitosa (por ejemplo, 404 o 500)
      throw new Error('Error al obtener los datos. La respuesta no fue exitosa.');
    }

    const data = response.data;

    if (data && data.error) {
      // Manejo de error si la respuesta contiene un campo de error
      throw new Error(`Error en la respuesta de la API: ${data.error}`);
    }

    return data;
  } catch (error) {
    console.error('Error al obtener los datos.');
    // Aquí podrías manejar la notificación de error al usuario, por ejemplo, mostrar un mensaje en la interfaz
    throw error; // Re-lanzar el error para que el componente que llama a esta función también pueda manejarlo
  }
};

export const insertData = async (urlName, params) => {
  try {
    const url = `${apiUrl}/api/${urlName}`;

    const response = await axios.post(url, params.body);

    if (response.status !== 200) {
      throw new Error('Error al agregar datos. La respuesta no fue exitosa.');
    }

    const data = response.data;

    if (data && data.error) {
      throw new Error(`Error en la respuesta de la API: ${data.error}`);
    }

    return data;
  } catch (error) {
    console.error('Error al agregar datos.');
    throw error;
  }
};

export const updateData = async (urlName, params) => {
  try {
    const url = `${apiUrl}/api/${urlName}/${params.id}`;

    const response = await axios.put(url, params.body);

    if (response.status !== 200) {
      throw new Error('Error al actualizar los datos. La respuesta no fue exitosa.');
    }

    const data = response.data;

    if (data && data.error) {
      throw new Error(`Error en la respuesta de la API: ${data.error}`);
    }

    return data;
  } catch (error) {
    console.error('Error al actualizar los datos.');
    throw error;
  }
};

export const deleteData = async (urlName, id) => {
  try {
    const url = `${apiUrl}/api/${urlName}/${id}`;

    const response = await axios.delete(url);

    if (response.status !== 200) {
      throw new Error('Error al eliminar los datos. La respuesta no fue exitosa.');
    }

    const data = response.data;

    if (data && data.error) {
      throw new Error(`Error en la respuesta de la API: ${data.error}`);
    }

    return data;
  } catch (error) {
    console.error('Error al eliminar los datos.');
    throw error;
  }
};