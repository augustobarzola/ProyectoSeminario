const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Define rutas y sus controladores
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.post('/', usersController.createUser);
router.put('/updatePassword/:id', usersController.updatePassword);
router.put('/toggleStatus/:id', usersController.toggleUserStatus);

module.exports = router;