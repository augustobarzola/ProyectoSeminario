// authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../database/db');
const secretKey = process.env.JWT_SECRET_KEY;

module.exports = {
  login: async (req, res) => {
    const { dni, password } = req.body;

    let password1 = parseInt(password);

    try {
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE dni = ? AND fecha_baja IS NULL', [dni]);

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Usuario/contraseña incorrectos' });
      }

      const usuario = rows[0];
      //const match = await bcrypt.compare(password1, usuario.contrasenia);
      const match = password1 === usuario.contrasenia;

      if (!match) {
        return res.status(401).json({ success: false, message: 'Usuario/contraseña incorrectos' });
      }

      // Crear token JWT
      const token = jwt.sign({ id_usuario: usuario.d_usuario, rol: usuario.id_rol }, secretKey, { expiresIn: '1h' });

      return res.json({
        success: true,
        token,
        userData: {
          id_usuario: usuario.id_usuario,
          usuario: usuario.nombre,
          dni: usuario.dni,
          rol: usuario.id_rol,
        },
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  },
  getUserData: async (req, res) => {
    try {
      const userId = req.userId;
      const [rows] = await pool.query('SELECT * FROM usuarios', [userId]);

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }

      const usuario = rows[0];
      return res.json({ success: true, user: usuario });
    } catch (error) {
      console.error('Error al obtener el perfil del usuario:', error);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  }
};