const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Configura CORS para permitir todas las solicitudes
app.use(cors());

// Alternativamente, puedes configurar CORS para permitir solo ciertos orígenes
app.use(cors({
  origin: 'http://localhost:3000', // Reemplaza con el origen de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
const errorMiddleware = require('./middlewares/errorMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');
const routes = require('./routes/_index');

// Middleware para parsear JSON
app.use(express.json());

// Rutas públicas (sin autenticación), por ejemplo, login
app.use('/api/auth', require('./routes/auth'));

// Rutas protegidas con autenticación
app.use('/api', authMiddleware, routes); // Aplicar authMiddleware aquí

// Middleware de errores
app.use(errorMiddleware);

// Puerto de escucha
const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});