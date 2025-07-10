// server.js
// -----------------------------------------------------------------------------
// Express backend for ViewBear, ready for Render or local deployment.
// Uses ES Modules (import syntax). Make sure you have `"type": "module"` in
// package.json *or* rename to server.mjs.
// -----------------------------------------------------------------------------

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Local modules ---------------------------------------------------------------
// Adjust the paths if your files live elsewhere.
import billboardRoutes from './routes.js'; // API endpoints
import db from './db.js'; // PostgreSQL connection pool

// ----------------------------------------------------------------------------
// Environment & basic app setup
// ----------------------------------------------------------------------------

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------------------------------------------------------------
// Middlewares
// ----------------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------------------------------------------------------------
// API routes – all backend endpoints are mounted under /api
// ----------------------------------------------------------------------------
app.use('/api', billboardRoutes);

// ----------------------------------------------------------------------------
// Health‑check & DB‑test endpoints (handy for Render)
// ----------------------------------------------------------------------------
app.get('/healthz', (req, res) => res.send('OK'));

app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ server_time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});
// ----------------------------------------------------------------------------
// Static file serving (React build) – comment out if you have separate frontend
// ----------------------------------------------------------------------------
// Resolve __dirname inside ES‑modules world
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the React build folder *IF* it exists (e.g. client/build)
const buildPath = path.join(__dirname, 'client', 'build');
app.use(express.static(buildPath));

// Catch‑all route so client‑side routing works (SPA fallback)
app.get('*', (req, res) => {
  // If index.html exists we serve it, otherwise just 404
  try {
    return res.sendFile(path.join(buildPath, 'index.html'));
  } catch (err) {
    res.status(404).send('Not Found');
  }
});

// ----------------------------------------------------------------------------
// Start server
// ----------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
