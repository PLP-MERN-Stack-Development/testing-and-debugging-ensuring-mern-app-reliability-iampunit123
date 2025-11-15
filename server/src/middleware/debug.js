const debugLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request details
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] Response (${duration}ms):`, data);
    return originalJson.call(this, data);
  };

  next();
};

const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  
  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong!'
    });
  }

  res.status(err.status || 500).json({
    error: err.message,
    stack: err.stack,
    ...err
  });
};

module.exports = { debugLogger, errorHandler };