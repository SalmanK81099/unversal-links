require('dotenv').config();
const connectDB = require('./src/config/database');
const app = require('./src/app');
const config = require('./src/config/environment');

// Connect to MongoDB
connectDB();

// Start server
app.listen(config.port, () => {
  console.log(`Deep linking server running on port ${config.port}`);
});
