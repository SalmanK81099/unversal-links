const rateLimit = require('express-rate-limit');
const config = require('../config/environment');

const apiLimiter = rateLimit({
  windowMs: config.security.rateLimiting.windowMs,
  max: config.security.rateLimiting.max,
  message: {
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
};
