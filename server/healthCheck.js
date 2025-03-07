// server/healthCheck.js
// This is a standalone health check endpoint that doesn't depend on the main application

// Simple Express app for health check
const express = require('express');
const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check endpoint hit');
  res.status(200).json({ status: 'ok' });
});

// Catch-all route
app.use('*', (req, res) => {
  res.status(200).json({ message: 'Health check server is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Health check error:', err);
  res.status(500).json({ error: 'Health check server error', message: err.message });
});

// Start server for local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Health check server running on port ${PORT}`));
}

// Export for Vercel
module.exports = app; 