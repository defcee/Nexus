import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || process.env.NODE_PORT || 8080;
const distSpa = path.resolve(process.cwd(), 'dist', 'spa');

// Serve static assets if present
app.use(express.static(distSpa, { index: false }));

// Health check for cPanel / CloudLinux selector
app.use(process.env.HEALTH_PATH || '/health', (req, res) => {
  res.type('text').send('ok');
});

// Serve index.html for SPA routes (including /admin)
app.use('*', (req, res) => {
  const indexPath = path.join(distSpa, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.type('html').sendFile(indexPath);
  } else {
    res.type('html').send('<!doctype html><html><body><h1>App not built yet</h1></body></html>');
  }
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
