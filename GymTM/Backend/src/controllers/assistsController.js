const db = require('../database/db');
const clientsController = require('./clientsController'); // Para buscar clientes
const usersController = require('./usersController');     // Para buscar usuarios (recepcionista)
const { convertToISODate, convertToDisplayDate } = require('../helpers/utils');

module.exports = {
  // Obtener todas las asistencias
  getAllAssists: async (req, res) => {
    try {
      const [assists] = await db.query(`
        SELECT a.id_asistencia, pc.dni, 
              CONCAT(pr.nombre, ', ', pr.apellido) AS nombre_recepcionista, 
              CONCAT(pc.nombre, ', ', pc.apellido) AS nombre_cliente,
              a.fecha_ingreso 
        FROM asistencias a
        INNER JOIN usuarios uc ON a.id_cliente = uc.id
        LEFT JOIN usuarios ur ON a.id_recepcionista = ur.id
        LEFT JOIN personas pc ON ur.id = pc.id_usuario
        LEFT JOIN personas pr ON uc.id = pr.id_usuario
        ORDER BY a.fecha_ingreso DESC
      `);

      // Convertir fechas a formato dd/mm/yyyy antes de devolver
      const assistsFormatted = assists.map(assist => ({
        ...assist,
        fecha_ingreso: convertToDisplayDate(assist.fecha_ingreso),
      }));

      res.json(assistsFormatted);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las asistencias.' });
    }
  },

  // Obtener asistencia por ID
  getAssistById: async (req, res) => {
    try {
      const assistId = req.params.id;
      const [assist] = await db.query(`
        SELECT a.id_asistencia, uc.dni, 
              CONCAT(pr.nombre, ', ', pr.apellido) AS nombre_recepcionista, 
              CONCAT(pc.nombre, ', ', pc.apellido) AS nombre_cliente
              a.fecha_ingreso 
        FROM asistencias a
        INNER JOIN usuarios uc ON a.id_cliente = uc.id
        LEFT JOIN usuarios ur ON a.id_recepcionista = ur.id
        LEFT JOIN personas pc ON ur.id = pr.id_usuario
        LEFT JOIN personas pr ON uc.id = pc.id_usuario
        WHERE a.id_asistencia = ?`, 
        [assistId]);

      if (assist.length === 0) {
        return res.status(404).json({ error: 'Asistencia no encontrada.' });
      }

      // Convertir fechas a formato dd/mm/yyyy antes de devolver
      const assistFormatted = {
        ...assist[0],
        fecha_ingreso: convertToDisplayDate(assist.fecha_ingreso),
      };

      res.json(assistFormatted);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la asistencia.' });
    }
  },

  // Registrar una nueva asistencia
  createAssist: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const { dni } = req.body;

      // Validar que se envió el dni
      if (!dni) {
        return res.status(400).json({ error: 'El campo "dni" es obligatorio.' });
      }

      // Buscar al cliente por DNI
      const [client] = await db.query('SELECT * FROM usuarios WHERE dni = ?', [dni]);

      if (client.length === 0) {
        return res.status(404).json({ error: 'Cliente no encontrado.' });
      }

      const id_cliente = client[0].id;

      // Obtener el id del recepcionista logueado (suponiendo que el recepcionista está logueado)
      const id_recepcionista = req.user.id; // Asumiendo que tienes un middleware de autenticación que guarda el usuario logueado

      // Registrar la asistencia
      const [result] = await db.query(
        'INSERT INTO asistencias (id_cliente, id_recepcionista, fecha_ingreso) VALUES (?, ?, NOW())',
        [id_cliente, id_recepcionista]
      );

      await connection.commit();
      res.json({ message: 'Asistencia registrada exitosamente.', id_asistencia: result.insertId });
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({ error: 'Error al registrar la asistencia.' });
    } finally {
      connection.release();
    }
  },

  // Eliminar una asistencia por ID
  deleteAssist: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const assistId = req.params.id;

      // Verificar si la asistencia existe
      const [assist] = await db.query('SELECT * FROM asistencias WHERE id_asistencia = ?', [assistId]);

      if (assist.length === 0) {
        return res.status(404).json({ error: 'Asistencia no encontrada.' });
      }

      // Eliminar la asistencia
      await db.query('DELETE FROM asistencias WHERE id_asistencia = ?', [assistId]);

      await connection.commit();
      res.json({ message: 'Asistencia eliminada exitosamente.' });
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar la asistencia.' });
    } finally {
      connection.release();
    }
  }
};