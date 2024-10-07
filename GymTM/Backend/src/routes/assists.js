const express = require('express');
const router = express.Router();
const assistsController = require('../controllers/assistsController');

// Define rutas y sus controladores
router.get('/', assistsController.getAllAssists);
router.get('/:id', assistsController.getAssistById);
router.post('/', assistsController.createAssist);
router.delete('/:id', assistsController.deleteAssist);

module.exports = router;