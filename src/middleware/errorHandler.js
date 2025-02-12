const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      error: 'Duplicate record found',
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: err.message,
    });
  }

  // Default error
  res.status(500).json({
    error: 'Internal server error',
  });
};

module.exports = errorHandler;
