const db = require('../database/db'); 
const { convertToISODate, convertToDisplayDate } = require('../helpers/utils');
const usersController = require('./usersController');

module.exports = {
  getAllClients: async (req, res) => {
    try {
      const [clientes] = await db.query('SELECT p.* FROM personas p JOIN usuarios u WHERE u.id_rol = 3');
      
      // Convertir fechas a formato dd/mm/yyyy antes de devolver
      const clientesFormatted = clientes.map(cliente => ({
        ...cliente,
        fecha_nacimiento: cliente.fecha_nacimiento ? convertToDisplayDate(cliente.fecha_nacimiento) : null,
        fecha_alta: cliente.fecha_alta ? convertToDisplayDate(cliente.fecha_alta) : null,
        fecha_baja: cliente.fecha_baja ? convertToDisplayDate(cliente.fecha_baja) : null,
      }));

      res.json(clientesFormatted);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los clientes.' });
    }
  },

  getClientById: async (req, res) => {
    try {
      const clientId = req.params.id;
      const [client] = await db.query('SELECT * FROM clientes WHERE id_usuario = ?', [clientId]);

      if (client.length === 0) {
        return res.status(404).json({ error: 'Cliente no encontrado.' });
      }

      // Convertir fechas a formato dd/mm/yyyy antes de devolver
      const clientFormatted = {
        ...client[0],
        fecha_nacimiento: client[0].fecha_nacimiento ? convertToDisplayDate(client[0].fecha_nacimiento) : null,
        fecha_alta: client[0].fecha_alta ? convertToDisplayDate(client[0].fecha_alta) : null,
        fecha_baja: client[0].fecha_baja ? convertToDisplayDate(client[0].fecha_baja) : null,
      };

      res.json(clientFormatted);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el cliente.' });
    }
  },

  createClient: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const { nombre, apellido, dni, sexo, fecha_nacimiento, calle, numero, ciudad, provincia, codigo_postal, pais, correo, telefono } = req.body;

      // Validar campos obligatorios
      if (!nombre || !apellido || !dni || !sexo) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
      }

      // Convertir fecha de nacimiento a formato ISO
      const fechaNacimientoISO = fecha_nacimiento ? convertToISODate(fecha_nacimiento) : null;

      // 1. Insertar usuario a través del controlador de usuarios
      const id_usuario = await usersController.createUserLogic(dni, dni, 3);

      // 2. Insertar domicilio
      const [domicilioResult] = await connection.query(
        'INSERT INTO domicilios (calle, numero, ciudad, provincia, codigo_postal, pais) VALUES (?, ?, ?, ?, ?, ?)',
        [calle, numero, ciudad, provincia, codigo_postal, pais]
      );
      const id_domicilio = domicilioResult.insertId;

      // 3. Insertar cliente
      await connection.query(
        'INSERT INTO personas (id_usuario, dni, sexo, nombre, apellido, fecha_nacimiento, id_domicilio, correo, telefono, fecha_alta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())',
        [id_usuario, dni, sexo, nombre, apellido, fechaNacimientoISO, id_domicilio, correo, telefono]
      );

      await connection.commit();
      res.json({ message: 'Cliente creado exitosamente.' });
      
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({ error: 'Error al crear el cliente.' });
    } finally {
      connection.release();
    }
  },

  updateClient: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const clientId = req.params.id;
      const { nombre, apellido, sexo, fecha_nacimiento, calle, numero, ciudad, provincia, codigo_postal, pais, correo, telefono } = req.body;

      if (!clientId) {
        return res.status(400).json({ error: 'El campo "id" es obligatorio.' });
      }

      // Convertir fecha de nacimiento a formato ISO
      const fechaNacimientoISO = fecha_nacimiento ? convertToISODate(fecha_nacimiento) : null;

      // 2. Insertar domicilio
      const [domicilioResult] = await connection.query(
        'INSERT INTO domicilios (calle, numero, ciudad, provincia, codigo_postal, pais) VALUES (?, ?, ?, ?, ?, ?)',
        [calle, numero, ciudad, provincia, codigo_postal, pais]
      );
      const id_domicilio = domicilioResult.insertId;

      // 3. Actualizar cliente
      await connection.query(
        'UPDATE personas SET nombre = ?, apellido = ?, sexo = ?, fecha_nacimiento = ?, id_domicilio = ?, correo = ?, telefono = ? WHERE id_usuario = ?',
        [nombre, apellido, sexo, fechaNacimientoISO, id_domicilio, correo, telefono, clientId]
      );

      await connection.commit();
      res.json({ message: 'Cliente actualizado exitosamente.' });
      
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el cliente.' });
    } finally {
      connection.release();
    }
  },

  toggleStatusClient: async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const clientId = req.params.id;

      if (!clientId) {
        return res.status(400).json({ error: 'El campo "id" es obligatorio.' });
      }

      // Cambiar el estado del cliente
      await connection.query('UPDATE clientes SET fecha_baja = IF(fecha_baja IS NULL, CURDATE(), NULL) WHERE id_usuario = ?', [clientId]);

      // Cambiar el estado del usuario a través del controlador de usuarios
      await usersController.toggleUserStatusLogic(clientId);

      await connection.commit();
      res.json({ message: 'Estado del cliente y su usuario actualizado exitosamente.' });
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el estado del cliente.' });
    } finally {
      connection.release();
    }
  }
};