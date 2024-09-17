const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ success: false, message: 'Token no proporcionado' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Token inválido' });
    }

    req.userId = decoded.id_usuario;
    req.userRole = decoded.rol;
    next();
  });
};

module.exports = verifyToken;