const bcrypt = require('bcrypt');
const db = require('../database/db');
const { convertToISODate, convertToDisplayDate } = require('../helpers/utils');

module.exports = {
  getUserAndValidatePassword: async (usuario, password) => {
    // Consultar al usuario, incluso si está dado de baja
    const [rows] = await db.query(`SELECT u.*, CONCAT(p.nombre, ', ', p.apellido) AS nombre_completo, r.nombre as rol, u.fecha_baja 
      FROM usuarios u 
      LEFT JOIN personas p ON u.id = p.id_usuario 
      LEFT JOIN roles r ON r.id = u.id_rol
      WHERE u.usuario = ?`, [usuario]);

    if (rows.length === 0) {
      throw new Error('Usuario/contraseña incorrectos');
    }

    const usuarioEncontrado = rows[0];

    // Verificar si el usuario está dado de baja
    if (usuarioEncontrado.fecha_baja !== null) {
      throw new Error('Usuario dado de baja');
    }

    // Comparar la contraseña solo si el usuario no está dado de baja
    const match = await bcrypt.compare(password.toString(), usuarioEncontrado.contrasenia);

    if (!match) {
      throw new Error('Usuario/contraseña incorrectos');
    }

    return usuarioEncontrado;
  },

  // Mover la lógica de creación a una función aparte
  createUserLogic: async (usuario, password, id_rol, dni, sexo, nombre, apellido, correo, telefono, especialidad = null) => {
    if (!usuario || !password || !id_rol || !dni || !nombre || !apellido) {
      throw new Error('Faltan campos obligatorios.');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password.toString(), 10);
    
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Insertar el usuario en la tabla `usuarios`
      const [userResult] = await connection.query(
        'INSERT INTO usuarios (usuario, contrasenia, id_rol, especialidad, fecha_alta) VALUES (?, ?, ?, ?, CURDATE())',
        [usuario, hashedPassword, id_rol, especialidad]
      );
      const id_usuario = userResult.insertId; // ID del usuario creado

      // Solamente para administrador o recepcionista ya que los otros tienen su controlador que crea a la persona
      if (id_rol === 1 || id_rol === 2) {
        // Insertar la persona relacionada en la tabla `personas`
        await connection.query(
          'INSERT INTO personas (id_usuario, dni, sexo, nombre, apellido, correo, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [id_usuario, dni, sexo, nombre, apellido, correo, telefono]
        );
      }
      
      // Confirmar la transacción
      await connection.commit();
      return id_usuario; // Retorna el ID del usuario creado
    } catch (error) {
      // Revertir la transacción en caso de error
      await connection.rollback();

      // Si el error es por duplicación de clave
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('El DNI ya está registrado.');
      }

      throw new Error('Error al crear el usuario y la persona: ' + error.message);
    } finally {
      connection.release();
    }
  },

  // Método que utiliza la lógica anterior para manejar solicitudes
  createUser: async (req, res) => {
    const { id_rol, dni, sexo, nombre, apellido, correo, telefono } = req.body;

    try {
      const userId = await module.exports.createUserLogic(
        dni, dni, id_rol, dni, sexo, nombre, apellido, correo, telefono
      );
      return res.json({ message: 'Usuario y persona creados exitosamente' });
    } catch (error) {
      console.error('Error al crear el usuario y la persona:', error);

      // Si el error es por duplicación de DNI
      if (error.message.includes('El DNI o usuario ya está registrado.')) {
        return res.status(409).json({ success: false, message: 'Error: El DNI ya está registrado.' });
      }

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
  
      const user = {
        ...usuarioSinContrasenia, // Datos del usuario sin la contraseña
        ...personasRows[0], // Agrega detalles de entrenador o cliente
        ...rolesRows[0] // Agrega el rol del usuario
      };

      // Convertir fechas a formato dd/mm/yyyy antes de devolver
      const userFormatted = {
        ...user,
        fecha_nacimiento: user.fecha_nacimiento ? convertToDisplayDate(user.fecha_nacimiento) : null,
        fecha_alta: user.fecha_alta ? convertToDisplayDate(user.fecha_alta) : null,
        fecha_baja: user.fecha_baja ? convertToDisplayDate(user.fecha_baja) : null,
      };

      return res.json(userFormatted);
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
    const userId = req.params.id;
    const { nueva_contrasenia } = req.body;
    
    try {
      // Hashear la nueva contraseña
      const hashedPassword = await bcrypt.hash(nueva_contrasenia.toString(), 10);

      await db.query('UPDATE usuarios SET contrasenia = ? WHERE id = ?', [hashedPassword, userId]);

      return res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      console.error('Error al modificar la contraseña:', error);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  },
  updateUser: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const userId = req.params.id;
        const { nombre, apellido, sexo, especialidad, id_rol, correo, telefono } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'El campo "id" es obligatorio.' });
        }

        // 1. Actualizar la tabla personas
        await connection.query(
            'UPDATE personas SET nombre = ?, apellido = ?, sexo = ?, correo = ?, telefono = ? WHERE id_usuario = ?',
            [nombre, apellido, sexo, correo, telefono, userId]
        );

        // 2. Actualizar la tabla usuarios
        await connection.query(
            'UPDATE usuarios SET especialidad = ?, id_rol = ? WHERE id = ?',
            [especialidad, id_rol, userId]
        );

        await connection.commit();
        res.json({ message: 'Usuario actualizado exitosamente.' });
        
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el usuario.' });
    } finally {
        connection.release();
    }
  },
};