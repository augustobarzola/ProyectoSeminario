const express = require('express');
const router = express.Router();
const trainersController = require('../controllers/trainersController');

// Define rutas y sus controladores
router.get('/', trainersController.getAllTrainers);
router.get('/:id', trainersController.getTrainerById);
router.post('/', trainersController.createTrainer);
router.put('/:id', trainersController.updateTrainer);
router.put('/toggleStatus/:id', trainersController.toggleStatusTrainer);

module.exports = router;