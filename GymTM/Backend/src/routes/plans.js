const express = require('express');
const router = express.Router();
const plansController = require('../controllers/plansController');

// Define rutas y sus controladores
router.get('/', plansController.getAllPlans);
router.get('/:id', plansController.getPlanById);
router.post('/', plansController.createPlan);
router.put('/:id', plansController.updatePlan);
router.put('/toggleStatus/:id', plansController.toggleStatusPlan);

module.exports = router;