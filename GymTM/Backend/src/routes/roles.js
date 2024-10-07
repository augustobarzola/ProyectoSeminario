const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');

// Define rutas y sus controladores
router.get('/', rolesController.getAllRoles);
router.get('/:id', rolesController.getRoleById);
router.post('/', rolesController.createRole);
router.put('/:id', rolesController.updateRole);
router.put('/toggleStatus/:id', rolesController.toggleStatusRole);

module.exports = router;