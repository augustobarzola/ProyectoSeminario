const express = require('express');
const router = express.Router();
const routinesController = require('../controllers/routinesController');

// Define rutas y sus controladores
router.get('/', routinesController.getAllRoutines);
router.get('/:id', routinesController.getRoutineById);
router.post('/', routinesController.createRoutine);
router.post('/asignar/', routinesController.assignRoutineToClient);
router.put('/:id', routinesController.updateRoutine);
// router.put('/toggleStatus/:id', routinesController.toggleStatusRoutine);

module.exports = router;