const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clientsController');

// Define rutas y sus controladores
router.get('/', clientsController.getAllClients);
router.get('/:name', clientsController.getClientsByName);
router.get('/id/:id', clientsController.getClientById);
router.post('/', clientsController.createClient);
router.put('/:id', clientsController.updateClient);
router.put('/toggleStatus/:id', clientsController.toggleStatusClient);

module.exports = router;