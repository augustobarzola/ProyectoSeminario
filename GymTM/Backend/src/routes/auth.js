const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para el login
router.post('/login', authController.login);

// Ruta para obtener los datos del usuario logueado
router.get('/user', authMiddleware, authController.getUserData);

// Ruta para cerrar sesión
router.post('/logout', authController.logout);

module.exports = router;