const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Ocurrió un error en el servidor',
  });
};

module.exports = errorMiddleware;