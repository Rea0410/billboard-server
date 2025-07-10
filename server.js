// -----------------------------------------------------------------------------
// Express backend for ViewBear - ready for Render or local deployment
// -----------------------------------------------------------------------------

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env variables
dotenv.config();

// -----------------------------------------------------------------------------
// Resolve __dirname for ES Modules
// -----------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------------------------------------------------------------
// App setup
// ----------------------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------------------------------------------------------------
// Local modules
// ----------------------------------------------------------------------------
import billboardRoutes from './routes.js'; // All API routes
import db from './db.js'; // PostgreSQL pool

// ----------------------------------------------------------------------------
// Middleware
// ----------------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------------------------------------------------------------
// API Routes
// ----------------------------------------------------------------------------
app.use('/api', billboardRoutes);

// ----------------------------------------------------------------------------
// Health check & DB test routes
// ----------------------------------------------------------------------------
app.get('/healthz', (req, res) => res.send('OK'));

app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ server_time: result.rows[0].now });
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// ----------------------------------------------------------------------------
// Serve React frontend build (if applicable)
// ----------------------------------------------------------------------------
const buildPath = path.join(__dirname, 'client', 'build');
app.use(express.static(buildPath));

// Catch-all route for SPA (Single Page App)
app.get('*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).send('Not Found');
    }
  });
});

// ----------------------------------------------------------------------------
// Start Server
// ----------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
