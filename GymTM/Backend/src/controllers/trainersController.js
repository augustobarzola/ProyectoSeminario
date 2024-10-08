const db = require('../database/db'); 
const { convertToISODate, convertToDisplayDate } = require('../helpers/utils');
const usersController = require('./usersController');

module.exports = {
  getAllTrainers: async (req, res) => {
    try {
      const [entrenadores] = await db.query('SELECT * FROM usuarios u LEFT JOIN personas p ON p.id_usuario = u.id WHERE u.id_rol = 3');
      
      // Convertir fechas a formato dd/mm/yyyy antes de devolver
      const entrenadoresFormatted = entrenadores.map(entrenador => ({
        ...entrenador,
        fecha_nacimiento: entrenador.fecha_nacimiento ? convertToDisplayDate(entrenador.fecha_nacimiento) : null,
        fecha_alta: entrenador.fecha_alta ? convertToDisplayDate(entrenador.fecha_alta) : null,
        fecha_baja: entrenador.fecha_baja ? convertToDisplayDate(entrenador.fecha_baja) : null,
      }));

      res.json(entrenadoresFormatted);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los entrenadores.' });
    }
  },

  getTrainerById: async (req, res) => {
    try {
      const trainerId = req.params.id;
      const [entrenador] = await db.query('SELECT * FROM usuarios u LEFT JOIN personas p ON p.id_usuario = u.id WHERE u.id = ? AND u.id_rol = 3', [trainerId]);

      if (entrenador.length === 0) {
        return res.status(404).json({ error: 'Entrenador no encontrado.' });
      }

      // Convertir fechas a formato dd/mm/yyyy antes de devolver
      const entrenadorFormatted = {
        ...entrenador[0],
        fecha_nacimiento: entrenador[0].fecha_nacimiento ? convertToDisplayDate(entrenador[0].fecha_nacimiento) : null,
        fecha_alta: entrenador[0].fecha_alta ? convertToDisplayDate(entrenador[0].fecha_alta) : null,
        fecha_baja: entrenador[0].fecha_baja ? convertToDisplayDate(entrenador[0].fecha_baja) : null,
      };

      res.json(entrenadorFormatted);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el entrenador.' });
    }
  },

  createTrainer: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const { nombre, apellido, dni, sexo, fecha_nacimiento, calle, numero, ciudad, provincia, codigo_postal, pais, correo, telefono, especialidad } = req.body;

      // Validar campos obligatorios
      if (!nombre || !apellido || !dni || !sexo) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
      }

      // Convertir fecha de nacimiento a formato ISO
      const fechaNacimientoISO = fecha_nacimiento ? convertToISODate(fecha_nacimiento) : null;

      // 1. Insertar usuario a través del controlador de usuarios
      const id_usuario = await usersController.createUserLogic(dni, dni, 3, dni, sexo, nombre, apellido, correo, telefono, especialidad);

      let id_domicilio;

      if (calle) {
        // 2. Insertar domicilio
        const [domicilioResult] = await connection.query(
          'INSERT INTO domicilios (calle, numero, ciudad, provincia, codigo_postal, pais) VALUES (?, ?, ?, ?, ?, ?)',
          [calle, numero, ciudad, provincia, codigo_postal, pais]
        );
        id_domicilio = domicilioResult.insertId;
      }

      // 3. Insertar entrenador
      await connection.query(
        'INSERT INTO personas (id_usuario, dni, sexo, nombre, apellido, fecha_nacimiento, id_domicilio, correo, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id_usuario, dni, sexo, nombre, apellido, fechaNacimientoISO, id_domicilio, correo, telefono]
      );

      await connection.commit();
      res.json({ message: 'Entrenador creado exitosamente.' });
      
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({ error: 'Error al crear el entrenador.' });
    } finally {
      connection.release();
    }
  },

  updateTrainer: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const trainerId = req.params.id;
      const { nombre, apellido, sexo, fecha_nacimiento, calle, numero, ciudad, provincia, codigo_postal, pais, correo, telefono, especialidad } = req.body;

      if (!trainerId) {
        return res.status(400).json({ error: 'El campo "id" es obligatorio.' });
      }

      // Convertir fecha de nacimiento a formato ISO
      const fechaNacimientoISO = fecha_nacimiento ? convertToISODate(fecha_nacimiento) : null;

      // 1. Actualizar usuario
      await connection.query(
        'UPDATE usuarios SET especialidad = ? WHERE id = ?',
        [especialidad, trainerId]
      );

      let id_domicilio;

      if (calle) {
        // 2. Insertar domicilio
        const [domicilioResult] = await connection.query(
          'INSERT INTO domicilios (calle, numero, ciudad, provincia, codigo_postal, pais) VALUES (?, ?, ?, ?, ?, ?)',
          [calle, numero, ciudad, provincia, codigo_postal, pais]
        );
        id_domicilio = domicilioResult.insertId;
      }

      // 3. Actualizar entrenador
      await connection.query(
        'UPDATE personas SET nombre = ?, apellido = ?, sexo = ?, fecha_nacimiento = ?, id_domicilio = ?, correo = ?, telefono = ? WHERE id_usuario = ?',
        [nombre, apellido, sexo, fechaNacimientoISO, id_domicilio, correo, telefono, trainerId]
      );

      await connection.commit();
      res.json({ message: 'Entrenador actualizado exitosamente.' });
      
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el entrenador.' });
    } finally {
      connection.release();
    }
  },

  toggleStatusTrainer: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const trainerId = req.params.id;

      if (!trainerId) {
        return res.status(400).json({ error: 'El campo "id" es obligatorio.' });
      }

      // Cambiar el estado del usuario a través del controlador de usuarios
      await usersController.toggleUserStatusLogic(trainerId);

      await connection.commit();
      res.json({ message: 'Estado del entrenador y su usuario actualizado exitosamente.' });
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el estado del entrenador.' });
    } finally {
      connection.release();
    }
  }
};