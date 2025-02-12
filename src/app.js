const express = require('express');
const useragent = require('express-useragent');
const cookieParser = require('cookie-parser');
const path = require('path');

// Import routes
const healthRoutes = require('./routes/health');
const apiRoutes = require('./routes/api');
const deepLinkRoutes = require('./routes/deepLink');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import services
const CleanupService = require('./services/cleanupService');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(useragent.express());
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/health', healthRoutes);
app.use('/api', apiRoutes);
app.use('/', deepLinkRoutes);

// Error handling
app.use(errorHandler);

// Start cleanup service
CleanupService.startCleanupSchedule();

module.exports = app;
