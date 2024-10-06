const db = require('../database/db');
const { convertToISODate, convertToDisplayDate } = require('../helpers/utils');

module.exports = {
  getAllPlans: async (req, res) => {
    try {
      const [planes] = await db.query('SELECT * FROM planes_pago');

      // Convertir fechas a formato dd/mm/yyyy antes de devolver
      const planesFormatted = planes.map(plane => ({
        ...plane,
        fecha_alta: convertToDisplayDate(plane.fecha_alta),
        fecha_baja: plane.fecha_baja ? convertToDisplayDate(plane.fecha_baja) : null,
      }));

      res.json(planesFormatted);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los planes de pago.' });
    }
  },

  getPlanById: async (req, res) => {
    try {
      const planId = req.params.id;
      const [plan] = await db.query('SELECT * FROM planes_pago WHERE id = ?', [planId]);

      if (plan.length === 0) {
        return res.status(404).json({ error: 'Plan de pago no encontrado.' });
      }

      // Convertir fechas a formato dd/mm/yyyy antes de devolver
      const planFormatted = {
        ...plan[0],
        fecha_alta: convertToDisplayDate(plan[0].fecha_alta),
        fecha_baja: plan[0].fecha_baja ? convertToDisplayDate(plan[0].fecha_baja) : null,
      };

      res.json(planFormatted);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el plan de pago.' });
    }
  },

  createPlan: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const { nombre, descripcion } = req.body;

      // Validar campos obligatorios
      if (!nombre) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
      }

      // Insertar plan de pago
      const [result] = await connection.query(
        'INSERT INTO planes_pago (nombre, descripcion, fecha_alta) VALUES (?, ?, CURDATE())',
        [nombre, descripcion]
      );

      await connection.commit();
      res.json({ message: 'Plan de pago creado exitosamente.', id: result.insertId });
      
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({ error: 'Error al crear el plan de pago.' });
    } finally {
      connection.release();
    }
  },

  updatePlan: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const planId = req.params.id;
      const { nombre, descripcion } = req.body;

      if (!planId) {
        return res.status(400).json({ error: 'El campo "id" es obligatorio.' });
      }

      // Actualizar plan de pago
      await connection.query(
        'UPDATE planes_pago SET nombre = ?, descripcion = ? WHERE id = ?',
        [nombre, descripcion, planId]
      );

      await connection.commit();
      res.json({ message: 'Plan de pago actualizado exitosamente.' });
      
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el plan de pago.' });
    } finally {
      connection.release();
    }
  },

  toggleStatusPlan: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const planId = req.params.id;

      if (!planId) {
        return res.status(400).json({ error: 'El campo "id" es obligatorio.' });
      }

      // Cambiar el estado del plan de pago
      await connection.query('UPDATE planes_pago SET fecha_baja = IF(fecha_baja IS NULL, CURDATE(), NULL) WHERE id = ?', [planId]);

      await connection.commit();
      res.json({ message: 'Estado del plan de pago actualizado exitosamente.' });
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el estado del plan de pago.' });
    } finally {
      connection.release();
    }
  }
};