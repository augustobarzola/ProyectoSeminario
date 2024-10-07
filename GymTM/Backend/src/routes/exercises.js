const express = require('express');
const router = express.Router();
const exercisesController = require('../controllers/exercisesController');

// Define rutas y sus controladores
router.get('/', exercisesController.getAllExercises);
router.get('/:id', exercisesController.getExerciseById);
router.post('/', exercisesController.createExercise);
router.put('/:id', exercisesController.updateExercise);
// router.put('/toggleStatus/:id', exercisesController.toggleStatusExercise);

module.exports = router;