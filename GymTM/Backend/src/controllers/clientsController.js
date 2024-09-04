module.exports = {
  getAllClients: async (req, res) => {
    try {
      const clients = [];

      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los clientes.' });
    }
  },
  getClientById: async (req, res) => {
    try {
      const clientId = req.params.id;

      const client = {};
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el cliente.' });
    }
  },
  getClientsByName: async (req, res) => {
    try {
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los clientes.' });
    }
  },
  createClient: async (req, res) => {
    try {
      const newClient = req.body;
  
      // Verificar que esten todos los campos obligatorios
      if (!newClient.name) {
        return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
      }
  
      res.json({ message: 'Cliente creado exitosamente.' });
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar el cliente.' });
    }
  },  
  updateClient: async (req, res) => {
    try {
      const clientId = req.params.id;
      const updatedClient = req.body;

      // Verificar que esten todos los campos obligatorios
      if (!updatedClient.id) {
        return res.status(400).json({ error: 'El campo "id" es obligatorio.' });
      }
      if (!updatedClient.name) {
        return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
      }
  
      res.json({ message: 'Cliente actualizado exitosamente.' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el cliente.' });
    }
  },  
  toggleStatusClient: async (req, res) => {
    try {
      const clientId = req.params.id;

      // Verificar que esten todos los campos obligatorios
      if (!clientId) {
        return res.status(400).json({ error: 'El campo "id" es obligatorio.' });
      }

      res.json({ message: 'Estado del cliente actualizado exitosamente.' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el estado del cliente.' });
    }
  }
};