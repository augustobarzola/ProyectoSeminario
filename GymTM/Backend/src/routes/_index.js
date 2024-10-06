const express = require('express');
const routes = express.Router();

// Define las rutas de la API
const clientsRoutes = require('./clients');
const usersRoutes = require('./users');
const plansRoutes = require('./plans');

// Define las rutas y sus controladores
routes.use('/clientes', clientsRoutes);
routes.use('/usuarios', usersRoutes);
routes.use('/planes', plansRoutes);

// Maneja las excepciones de las rutas
routes.use("*", (req, res, next) => {
  const error = new Error(`Ruta '${req.originalUrl}' no encontrada.`);
  next(error);
});

module.exports = routes;