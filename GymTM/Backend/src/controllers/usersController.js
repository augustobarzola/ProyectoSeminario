const bcrypt = require('bcrypt');
const db = require('../database/db');
const { convertToISODate, convertToDisplayDate } = require('../helpers/utils');

module.exports = {
  getUserAndValidatePassword: async (usuario, password) => {
    // Consultar al usuario, incluyendo roles
    const [rows] = await db.query(`
      SELECT u.*, 
             CONCAT(p.nombre, ', ', p.apellido) AS nombre_completo, 
             JSON_ARRAYAGG(JSON_OBJECT('id', r.id, 'nombre', r.nombre, 'descripcion', r.descripcion)) AS roles,
             u.fecha_baja 
      FROM usuarios u 
      LEFT JOIN personas p ON u.id = p.id_usuario 
      LEFT JOIN usuarios_roles ur ON u.id = ur.id_usuario
      LEFT JOIN roles r ON r.id = ur.id_rol
      WHERE u.usuario = ? 
      GROUP BY u.id`, 
      [usuario]
    );    
  
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
  createUserLogic: async (usuario, password, id_roles, documento, sexo, nombre, apellido, correo, telefono, id_especialidades = null) => {
    if (!usuario || !password || !id_roles || !documento || !nombre || !apellido) {
      throw new Error('Faltan campos obligatorios.');
    }
  
    const hashedPassword = await bcrypt.hash(password.toString(), 10);
    
    const connection = await db.getConnection();
    await connection.beginTransaction();
  
    try {
      const [userResult] = await connection.query(
        'INSERT INTO usuarios (usuario, contrasenia, fecha_alta) VALUES (?, ?, CURDATE())',
        [usuario, hashedPassword]
      );
      const id_usuario = userResult.insertId;
  
      for (const id_rol of id_roles) {
        await connection.query(
          'INSERT INTO usuarios_roles (id_usuario, id_rol) VALUES (?, ?)',
          [id_usuario, id_rol]
        );
      }

      if (id_especialidades && id_especialidades.length > 0) {
        for (const id_especialidad of id_especialidades) {
          await connection.query(
            'INSERT INTO usuarios_especialidades (id_usuario, id_especialidad) VALUES (?, ?)',
            [id_usuario, id_especialidad]
          );
        }
      }
      
      if (id_roles.includes(1) || id_roles.includes(2)) {
        await connection.query(
          'INSERT INTO personas (id_usuario, documento, sexo, nombre, apellido, correo, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [id_usuario, documento, sexo, nombre, apellido, correo, telefono]
        );
      }
      
      await connection.commit();
      return id_usuario;
    } catch (error) {
      await connection.rollback();
      throw new Error('Error al crear el usuario y la persona: ' + error.message);
    } finally {
      connection.release();
    }
  },  

  // Método que utiliza la lógica anterior para manejar solicitudes
  createUser: async (req, res) => {
    const { id_roles, documento, sexo, nombre, apellido, correo, telefono, id_especialidades } = req.body;

    try {
      const userId = await module.exports.createUserLogic(
        documento, documento, id_roles, documento, sexo, nombre, apellido, correo, telefono, id_especialidades
      );
      return res.json({ message: 'Usuario y persona creados exitosamente' });
    } catch (error) {
      console.error('Error al crear el usuario y la persona:', error);

      if (error.message.includes('El documento o usuario ya está registrado.')) {
        return res.status(409).json({ success: false, message: 'Error: El documento ya está registrado.' });
      }

      return res.status(500).json({ success: false, message: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const [userRows] = await db.query(`
        SELECT u.*, 
              p.*,  
              JSON_ARRAYAGG( JSON_OBJECT('id', r.id, 'nombre', r.nombre)) AS roles,
              CASE 
                  WHEN COUNT(e.id) > 0 THEN JSON_ARRAYAGG( JSON_OBJECT('id', e.id, 'nombre', e.nombre, 'descripcion', r.descripcion)) 
                  ELSE null 
              END AS especialidades,
              u.fecha_baja 
        FROM usuarios u 
        LEFT JOIN personas p ON u.id = p.id_usuario 
        LEFT JOIN usuarios_roles ur ON u.id = ur.id_usuario
        LEFT JOIN roles r ON r.id = ur.id_rol
        LEFT JOIN usuarios_especialidades ue ON u.id = ue.id_usuario
        LEFT JOIN especialidades e ON e.id = ue.id_especialidad
        GROUP BY u.id;
      `);
      
      // Formatear las fechas
      const usersWithDetailsFormatted = userRows.map(user => ({
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
      const [userRows] = await db.query(`
        SELECT u.*, 
              p.*,  
              JSON_ARRAYAGG( JSON_OBJECT('id', r.id, 'nombre', r.nombre, 'descripcion', r.descripcion)) AS roles,
              CASE 
                  WHEN COUNT(e.id) > 0 THEN JSON_ARRAYAGG( JSON_OBJECT('id', e.id, 'nombre', e.nombre)) 
                  ELSE null 
              END AS especialidades,
              u.fecha_baja 
        FROM usuarios u 
        LEFT JOIN personas p ON u.id = p.id_usuario 
        LEFT JOIN usuarios_roles ur ON u.id = ur.id_usuario
        LEFT JOIN roles r ON r.id = ur.id_rol
        LEFT JOIN usuarios_especialidades ue ON u.id = ue.id_usuario
        LEFT JOIN especialidades e ON e.id = ue.id_especialidad
        WHERE u.id = ?
        GROUP BY u.id;
      `, [userId]);
  
      if (userRows.length === 0) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
  
      const usuario = userRows[0];
      const userFormatted = {
        ...usuario,
        fecha_nacimiento: usuario.fecha_nacimiento ? convertToDisplayDate(usuario.fecha_nacimiento) : null,
        fecha_alta: usuario.fecha_alta ? convertToDisplayDate(usuario.fecha_alta) : null,
        fecha_baja: usuario.fecha_baja ? convertToDisplayDate(usuario.fecha_baja) : null,
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
        const { nombre, apellido, sexo, id_roles, id_especialidades, correo, telefono } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'El campo "id" es obligatorio.' });
        }

        await connection.query(
            'UPDATE personas SET nombre = ?, apellido = ?, sexo = ?, correo = ?, telefono = ? WHERE id_usuario = ?',
            [nombre, apellido, sexo, correo, telefono, userId]
        );

        await connection.query('DELETE FROM usuarios_roles WHERE id_usuario = ?', [userId]);
        for (const id_rol of id_roles) {
            await connection.query(
                'INSERT INTO usuarios_roles (id_usuario, id_rol) VALUES (?, ?)',
                [userId, id_rol]
            );
        }

        await connection.query('DELETE FROM usuarios_especialidades WHERE id_usuario = ?', [userId]);
        for (const id_especialidad of id_especialidades) {
            await connection.query(
                'INSERT INTO usuarios_especialidades (id_usuario, id_especialidad) VALUES (?, ?)',
                [userId, id_especialidad]
            );
        }

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