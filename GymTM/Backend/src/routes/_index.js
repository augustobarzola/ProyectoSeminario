const express = require('express');
const routes = express.Router();

// Define las rutas de la API
const clientsRoutes = require('./clients');
const trainersRoutes = require('./trainers');
const usersRoutes = require('./users');
const plansRoutes = require('./plans');
const routinesRoutes = require('./routines');
const exercisesRoutes = require('./exercises');
const rolesRoutes = require('./roles');

// Define las rutas y sus controladores
routes.use('/clientes', clientsRoutes);
routes.use('/entrenadores', trainersRoutes);
routes.use('/usuarios', usersRoutes);
routes.use('/planes', plansRoutes);
routes.use('/rutinas', routinesRoutes);
routes.use('/ejercicios', exercisesRoutes);
routes.use('/roles', rolesRoutes);

// Maneja las exepciones de las rutas
routes.use("*", (req, res, next) => {
  const error = new Error(`Ruta '${req.originalUrl}' no encontrada.`);
  next(error);
});

module.exports = routes;