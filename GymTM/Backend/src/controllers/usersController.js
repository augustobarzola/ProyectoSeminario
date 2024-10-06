const bcrypt = require('bcrypt');
const db = require('../database/db');
const { convertToISODate, convertToDisplayDate } = require('../helpers/utils');

module.exports = {
  getUserAndValidatePassword: async (usuario, password) => {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE usuario = ? AND fecha_baja IS NULL', [usuario]);

    if (rows.length === 0) {
      throw new Error('Usuario/contraseña incorrectos');
    }

    const usuarioEncontrado = rows[0];
    const match = await bcrypt.compare(password.toString(), usuarioEncontrado.contrasenia);

    if (!match) {
      throw new Error('Usuario/contraseña incorrectos');
    }

    return usuarioEncontrado;
  },

  // Mover la lógica de creación a una función aparte
  createUserLogic: async (usuario, password, id_rol) => {
    // Validar campos obligatorios
    if (!usuario || !password || !id_rol) {
      throw new Error('Faltan campos obligatorios.');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password.toString(), 10);
    
    const [result] = await db.query(
      'INSERT INTO usuarios (usuario, contrasenia, id_rol, fecha_alta) VALUES (?, ?, ?, CURDATE())',
      [usuario, hashedPassword, id_rol]
    );

    return result.insertId; // Retorna el ID del usuario creado
  },

  // Método que utiliza la lógica anterior para manejar solicitudes
  createUser: async (req, res) => {
    const { usuario, password, id_rol } = req.body;

    try {
      const userId = await module.exports.createUserLogic(usuario, password, id_rol);
      return res.status(201).json({ success: true, message: 'Usuario creado exitosamente', userId });
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      // Obtener todos los usuarios
      const [userRows] = await db.query('SELECT * FROM usuarios');
  
      // Crear un array para almacenar los usuarios con sus datos asociados
      const usersWithDetails = await Promise.all(userRows.map(async (usuario) => {
        // Obtener datos adicionales 
        const [personasRows] = await db.query('SELECT * FROM personas WHERE id_usuario = ?', [usuario.id]);
        const [rolesRows] = await db.query('SELECT nombre as rol FROM roles WHERE id = ?', [usuario.id_rol]);

        // Desestructurar para crear un nuevo objeto sin la contraseña
        const { contrasenia, ...usuarioSinContrasenia } = usuario;
  
        return {
          ...usuarioSinContrasenia, // Datos del usuario sin la contraseña
          ...personasRows[0], // Agrega detalles de entrenador o cliente
          ...rolesRows[0]
        };
      }));
  
      // Convertir fechas a formato dd/mm/yyyy antes de devolver
      const usersWithDetailsFormatted = usersWithDetails.map(user => ({
        ...user,
        fecha_nacimiento: user.fecha_nacimiento ? convertToDisplayDate(user.fecha_nacimiento) : null,
        fecha_alta: user.fecha_alta ? convertToDisplayDate(user.fecha_alta) : null,
        fecha_baja: user.fecha_baja ? convertToDisplayDate(user.fecha_baja) : null,
      }));
  
      return res.json(usersWithDetailsFormatted);
    } catch (error) {
      console.error('Error al obtener todos los usuarios:', error);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  },
  
  getUserById: async (req, res) => {
    const userId = req.params.id;
  
    try {
      // Obtener los datos del usuario
      const [userRows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [userId]);
  
      if (userRows.length === 0) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
  
      const usuario = userRows[0];
  
      // Desestructurar para crear un nuevo objeto sin la contraseña
      const { contrasenia, ...usuarioSinContrasenia } = usuario;
  
      // Obtener datos adicionales 
      const [personasRows] = await db.query('SELECT * FROM personas WHERE id_usuario = ?', [usuario.id]);
      const [rolesRows] = await db.query('SELECT nombre as rol FROM roles WHERE id = ?', [usuario.id_rol]);
  
      return res.json({
        ...usuarioSinContrasenia, // Datos del usuario sin la contraseña
        ...personasRows[0], // Agrega detalles de entrenador o cliente
        ...rolesRows[0] // Agrega el rol del usuario
      });
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  },  

  toggleUserStatusLogic: async (userId) => {
    // Validar que el ID de usuario sea válido
    if (!userId) {
      throw new Error('ID de usuario es requerido.');
    }

    // Actualizar el estado del usuario (fecha_baja)
    const [result] = await db.query(
      'UPDATE usuarios SET fecha_baja = IF(fecha_baja IS NULL, CURDATE(), NULL) WHERE id = ?',
      [userId]
    );

    if (result.affectedRows === 0) {
      throw new Error('Usuario no encontrado o no se pudo actualizar el estado.');
    }

    return result; // Retorna el resultado de la consulta
  },

  // Controlador para manejar la petición desde el frontend
  toggleUserStatus: async (req, res) => {
    const userId = req.params.id;

    try {
      // Llama a la función de lógica de cambio de estado
      await module.exports.toggleUserStatusLogic(userId);

      return res.json({ success: true, message: 'Estado del usuario actualizado exitosamente' });
    } catch (error) {
      console.error('Error al cambiar el estado del usuario:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  updatePassword: async (req, res) => {
    const { iid, newPassword } = req.body;

    try {
      // Hashear la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword.toString(), 10);

      await db.query('UPDATE usuarios SET contrasenia = ? WHERE id = ?', [hashedPassword, iid]);

      return res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      console.error('Error al modificar la contraseña:', error);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  },
};