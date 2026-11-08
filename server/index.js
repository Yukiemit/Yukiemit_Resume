// Local server: `npm run dev` (API only, Vite serves the page) or `npm start` (API + built site).
// On Vercel this file isn't used — see api/index.js.
import express from 'express';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import app from './app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const DIST = path.join(__dirname, '..', 'dist');

const server = express();
server.use(app);

if (existsSync(DIST)) {
  server.use(express.static(DIST));
  server.get('*', (_req, res) => res.sendFile(path.join(DIST, 'index.html')));
}

server.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
  if (existsSync(DIST)) console.log(`Serving built site on http://localhost:${PORT}`);
});
