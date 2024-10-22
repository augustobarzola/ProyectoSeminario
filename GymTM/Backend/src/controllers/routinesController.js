const db = require('../database/db');
const { convertToISODate, convertToDisplayDate } = require('../helpers/utils');

module.exports = {
  // Obtener todas las rutinas
  getAllRoutines: async (req, res) => {
    try {
      const { id_entrenador, id_rol } = req.params; // Extraemos el id_entrenador de los query params
      let query = `
        SELECT r.*, CONCAT(p.nombre, ', ', p.apellido) AS entrenador_nombre
        FROM rutinas r
        LEFT JOIN usuarios u ON r.id_entrenador = u.id
        LEFT JOIN personas p ON u.id = p.id_usuario
      `;
  
      // Si se proporciona el id_entrenador, agregamos la condición WHERE
      if (id_entrenador && id_rol !== 1) {
        query += ` WHERE r.id_entrenador = ?`;
      }
  
      // Ejecutamos la consulta con o sin parámetro según corresponda
      const [rutinas] = await db.query(query, id_entrenador ? [id_entrenador] : []);
  
      // Formatear la fecha
      const rutinasFormatted = rutinas.map(rutina => ({
        ...rutina,
        fecha_creacion: convertToDisplayDate(rutina.fecha_creacion),
      }));
  
      console.log(rutinasFormatted);
      res.json(rutinasFormatted);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las rutinas.' });
    }
  },  

  // Obtener una rutina por ID
  getRoutineById: async (req, res) => {
    try {
      const rutinaId = req.params.id;

      const [rutina] = await db.query(`
        SELECT r.*, CONCAT(p.nombre, ', ', p.apellido) AS entrenador_nombre
        FROM rutinas r
        LEFT JOIN usuarios u ON r.id_entrenador = u.id
        LEFT JOIN personas p ON u.id = p.id_usuario
      `, [rutinaId]);

      if (rutina.length === 0) {
        return res.status(404).json({ error: 'Rutina no encontrada.' });
      }

      // Obtener detalles de los ejercicios de la rutina
      const [detalles] = await db.query(`
        SELECT e.nombre, dre.series, dre.repeticiones, dre.tiempo_descanso, dre.explicacion
        FROM detalles_rutina_ejercicios dre
        JOIN ejercicios e ON dre.id_ejercicio = e.id
        WHERE dre.id_rutina = ?
      `, [rutinaId]);

      res.json({
        ...rutina[0],
        fecha_creacion: convertToDisplayDate(rutina[0].fecha_creacion),
        ejercicios: detalles
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la rutina.' });
    }
  },

  // Crear una rutina nueva
  createRoutine: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const { nombre_rutina, descripcion, id_entrenador, ejercicios } = req.body;

      if (!nombre_rutina || !id_entrenador || !ejercicios || ejercicios.length === 0) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
      }

      // Insertar la rutina
      const [result] = await connection.query(`
        INSERT INTO rutinas (nombre_rutina, descripcion, fecha_creacion, id_entrenador)
        VALUES (?, ?, CURDATE(), ?)
      `, [nombre_rutina, descripcion, id_entrenador]);

      const rutinaId = result.insertId;

      // Insertar los ejercicios relacionados
      for (const ejercicio of ejercicios) {
        const { id_ejercicio, series, repeticiones, tiempo_descanso, explicacion } = ejercicio;
        await connection.query(`
          INSERT INTO detalles_rutina_ejercicios (id_rutina, id_ejercicio, series, repeticiones, tiempo_descanso, explicacion)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [rutinaId, id_ejercicio, series, repeticiones, tiempo_descanso, explicacion]);
      }

      await connection.commit();
      res.json({ message: 'Rutina creada exitosamente.', id: rutinaId });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ error: 'Error al crear la rutina.' });
    } finally {
      connection.release();
    }
  },

  // Actualizar una rutina
  updateRoutine: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const rutinaId = req.params.id;
      const { nombre_rutina, descripcion, id_entrenador, ejercicios } = req.body;

      if (!rutinaId || !nombre_rutina || !id_entrenador) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
      }

      // Actualizar la rutina
      await connection.query(`
        UPDATE rutinas
        SET nombre_rutina = ?, descripcion = ?, id_entrenador = ?
        WHERE id = ?
      `, [nombre_rutina, descripcion, id_entrenador, rutinaId]);

      // Actualizar ejercicios de la rutina (eliminamos y volvemos a insertar)
      await connection.query('DELETE FROM detalles_rutina_ejercicios WHERE id_rutina = ?', [rutinaId]);

      for (const ejercicio of ejercicios) {
        const { id_ejercicio, series, repeticiones, tiempo_descanso, explicacion } = ejercicio;
        await connection.query(`
          INSERT INTO detalles_rutina_ejercicios (id_rutina, id_ejercicio, series, repeticiones, tiempo_descanso, explicacion)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [rutinaId, id_ejercicio, series, repeticiones, tiempo_descanso, explicacion]);
      }

      await connection.commit();
      res.json({ message: 'Rutina actualizada exitosamente.' });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ error: 'Error al actualizar la rutina.' });
    } finally {
      connection.release();
    }
  },

  // Asignar una rutina a un cliente
  assignRoutineToClient: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const { id_cliente, id_rutina, fecha_inicio, observaciones } = req.body;

      if (!id_cliente || !id_rutina || !fecha_inicio) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
      }

      await connection.query(`
        INSERT INTO clientes_rutinas (id_cliente, id_rutina, fecha_inicio, observaciones)
        VALUES (?, ?, ?, ?)
      `, [id_cliente, id_rutina, fecha_inicio, observaciones]);

      await connection.commit();
      res.json({ message: 'Rutina asignada al cliente exitosamente.' });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ error: 'Error al asignar la rutina.' });
    } finally {
      connection.release();
    }
  },

  // Eliminar una rutina
  deleteRoutine: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
  
    try {
      const rutinaId = req.params.id;
  
      // Verificar si la rutina está asociada a algún cliente
      const [asociaciones] = await connection.query(
        'SELECT COUNT(*) AS total FROM clientes_rutinas WHERE id_rutina = ?',
        [rutinaId]
      );
  
      if (asociaciones[0].total > 0) {
        // Si la rutina está asociada a uno o más clientes, no se elimina
        await connection.rollback();
        return res.status(400).json({ error: 'No se puede eliminar la rutina porque está asociada a uno o más clientes.' });
      }
  
      // Eliminar los detalles de la rutina en caso de que no haya asociaciones
      await connection.query('DELETE FROM detalles_rutina_ejercicios WHERE id_rutina = ?', [rutinaId]);
  
      // Eliminar la rutina
      await connection.query('DELETE FROM rutinas WHERE id = ?', [rutinaId]);
  
      // Confirmar la transacción
      await connection.commit();
      res.json({ message: 'Rutina eliminada exitosamente.' });
    } catch (error) {
      // Si ocurre un error, hacer rollback
      await connection.rollback();
      res.status(500).json({ error: 'Error al eliminar la rutina.' });
    } finally {
      // Liberar la conexión
      connection.release();
    }
  }  
};