const db = require('../database/db'); 

module.exports = {
  getAllClients: async (req, res) => {
    try {
      const [clients] = await db.query('SELECT * FROM Clients');
      res.json(clients);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al obtener los clientes.' });
    }
  },

  getClientById: async (req, res) => {
    try {
      const clientId = req.params.id;
      const [client] = await db.query('SELECT * FROM clients WHERE id = ?', [clientId]);

      if (client.length === 0) {
        return res.status(404).json({ error: 'Cliente no encontrado.' });
      }

      res.json(client[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el cliente.' });
    }
  },

  getClientsByName: async (req, res) => {
    try {
      const clientName = req.query.name;
      const [clients] = await db.query('SELECT * FROM clients WHERE name LIKE ?', [`%${clientName}%`]);

      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los clientes.' });
    }
  },

  createClient: async (req, res) => {
    try {
      const { name, email, phone } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
      }

      const result = await db.query('INSERT INTO clients (name, email, phone) VALUES (?, ?, ?)', [name, email, phone]);
      res.json({ message: 'Cliente creado exitosamente.', id: result[0].insertId });
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar el cliente.' });
    }
  },

  updateClient: async (req, res) => {
    try {
      const clientId = req.params.id;
      const { name, email, phone } = req.body;

      if (!clientId) {
        return res.status(400).json({ error: 'El campo "id" es obligatorio.' });
      }

      if (!name) {
        return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
      }

      await db.query('UPDATE clients SET name = ?, email = ?, phone = ? WHERE id = ?', [name, email, phone, clientId]);

      res.json({ message: 'Cliente actualizado exitosamente.' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el cliente.' });
    }
  },

  toggleStatusClient: async (req, res) => {
    try {
      const clientId = req.params.id;

      if (!clientId) {
        return res.status(400).json({ error: 'El campo "id" es obligatorio.' });
      }

      // Cambiar el estado del cliente (activo/inactivo, por ejemplo)
      await db.query('UPDATE clients SET active = NOT active WHERE id = ?', [clientId]);

      res.json({ message: 'Estado del cliente actualizado exitosamente.' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el estado del cliente.' });
    }
  }
};