const db = require('../database/db');
const { convertToISODate, convertToDisplayDate } = require('../helpers/utils');

module.exports = {
  getAllRoles: async (req, res) => {
    try {
      const [roles] = await db.query('SELECT * FROM roles');

      // Convertir fechas a formato dd/mm/yyyy antes de devolver
      const rolesFormatted = roles.map(role => ({
        ...role,
        fecha_alta: convertToDisplayDate(role.fecha_alta),
        fecha_baja: role.fecha_baja ? convertToDisplayDate(role.fecha_baja) : null,
      }));

      res.json(rolesFormatted);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los roles.' });
    }
  },

  getRoleById: async (req, res) => {
    try {
      const roleId = req.params.id;
      const [role] = await db.query('SELECT * FROM roles WHERE id = ?', [roleId]);

      if (role.length === 0) {
        return res.status(404).json({ error: 'Rol no encontrado.' });
      }

      // Convertir fechas a formato dd/mm/yyyy antes de devolver
      const roleFormatted = {
        ...role[0],
        fecha_alta: convertToDisplayDate(role[0].fecha_alta),
        fecha_baja: role[0].fecha_baja ? convertToDisplayDate(role[0].fecha_baja) : null,
      };

      res.json(roleFormatted);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el rol.' });
    }
  },

  createRole: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const { nombre, descripcion } = req.body;

      // Validar campos obligatorios
      if (!nombre) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
      }

      // Insertar rol
      const [result] = await connection.query(
        'INSERT INTO roles (nombre, descripcion, fecha_alta) VALUES (?, ?, CURDATE())',
        [nombre, descripcion]
      );

      await connection.commit();
      res.json({ message: 'Rol creado exitosamente.', id: result.insertId });
      
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({ error: 'Error al crear el rol.' });
    } finally {
      connection.release();
    }
  },

  updateRole: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const roleId = req.params.id;
      const { nombre, descripcion } = req.body;

      if (!roleId) {
        return res.status(400).json({ error: 'El campo "id" es obligatorio.' });
      }

      // Actualizar rol
      await connection.query(
        'UPDATE roles SET nombre = ?, descripcion = ? WHERE id = ?',
        [nombre, descripcion, roleId]
      );

      await connection.commit();
      res.json({ message: 'Rol actualizado exitosamente.' });
      
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el rol.' });
    } finally {
      connection.release();
    }
  },

  toggleStatusRole: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const roleId = req.params.id;

      if (!roleId) {
        return res.status(400).json({ error: 'El campo "id" es obligatorio.' });
      }

      // Cambiar el estado del rol (activar/desactivar)
      await connection.query('UPDATE roles SET fecha_baja = IF(fecha_baja IS NULL, CURDATE(), NULL) WHERE id = ?', [roleId]);

      await connection.commit();
      res.json({ message: 'Estado del rol actualizado exitosamente.' });
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el estado del rol.' });
    } finally {
      connection.release();
    }
  }
};