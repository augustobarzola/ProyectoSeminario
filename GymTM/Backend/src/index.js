const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();

const app = express();

// Configura CORS para permitir solo el origen del frontend y habilitar el uso de cookies
app.use(cors({
  origin: 'http://localhost:3000', // Reemplaza con la URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Habilitar el envío de cookies en solicitudes de origen cruzado
}));

// cookie-parser para leer cookies
app.use(cookieParser()); 

// Middleware para parsear JSON
app.use(express.json());

// Middlewares
const errorMiddleware = require('./middlewares/errorMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');
const routes = require('./routes/_index');

// Rutas públicas (sin autenticación), por ejemplo, login
app.use('/api/auth', require('./routes/auth'));

// Rutas protegidas con autenticación
app.use('/api', authMiddleware, routes);

// Middleware de errores
app.use(errorMiddleware);

// Puerto de escucha
const PORT = process.env.APP_PORT || 3000;




app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});