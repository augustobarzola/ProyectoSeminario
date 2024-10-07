const db = require('../database/db');

module.exports = {
  // Obtener todos los ejercicios
  getAllExercises: async (req, res) => {
    try {
      const [exercises] = await db.query('SELECT * FROM ejercicios');
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los ejercicios.' });
    }
  },

  // Obtener un ejercicio por su ID
  getExerciseById: async (req, res) => {
    try {
      const exerciseId = req.params.id;
      const [exercise] = await db.query('SELECT * FROM ejercicios WHERE id = ?', [exerciseId]);

      if (exercise.length === 0) {
        return res.status(404).json({ error: 'Ejercicio no encontrado.' });
      }

      res.json(exercise[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el ejercicio.' });
    }
  },

  // Crear un nuevo ejercicio
  createExercise: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const { nombre, descripcion } = req.body;

      // Validar campos obligatorios
      if (!nombre) {
        return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
      }

      // Insertar nuevo ejercicio
      const [result] = await connection.query(
        'INSERT INTO ejercicios (nombre, descripcion) VALUES (?, ?)',
        [nombre, descripcion]
      );

      await connection.commit();
      res.json({ message: 'Ejercicio creado exitosamente.', id: result.insertId });
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({ error: 'Error al crear el ejercicio.' });
    } finally {
      connection.release();
    }
  },

  // Actualizar un ejercicio existente
  updateExercise: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const exerciseId = req.params.id;
      const { nombre, descripcion } = req.body;

      if (!exerciseId) {
        return res.status(400).json({ error: 'El campo "id" es obligatorio.' });
      }

      // Actualizar el ejercicio
      await connection.query(
        'UPDATE ejercicios SET nombre = ?, descripcion = ? WHERE id = ?',
        [nombre, descripcion, exerciseId]
      );

      await connection.commit();
      res.json({ message: 'Ejercicio actualizado exitosamente.' });
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el ejercicio.' });
    } finally {
      connection.release();
    }
  },

  // Eliminar un ejercicio por su ID
  deleteExercise: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const exerciseId = req.params.id;

      if (!exerciseId) {
        return res.status(400).json({ error: 'El campo "id" es obligatorio.' });
      }

      // Eliminar el ejercicio
      await connection.query('DELETE FROM ejercicios WHERE id = ?', [exerciseId]);

      await connection.commit();
      res.json({ message: 'Ejercicio eliminado exitosamente.' });
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar el ejercicio.' });
    } finally {
      connection.release();
    }
  }
};