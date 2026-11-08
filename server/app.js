// The Express API. Shared by:
//   • server/index.js — local dev / `npm start` (adds static files + app.listen)
//   • api/index.js    — Vercel, where it runs as a serverless function
import express from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { portfolio } from './data/portfolio.js';
import { getActivity } from './lib/activity.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ON_VERCEL = Boolean(process.env.VERCEL);

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', true); // so req.ip is the visitor's IP behind Vercel's proxy
app.use(express.json({ limit: '20kb' }));

const api = express.Router();

/* ---------- Content ---------- */

api.get('/health', (_req, res) => res.json({ ok: true }));

api.get('/portfolio', (_req, res) => res.json(portfolio));

api.get('/activity', async (_req, res) => {
  res.set('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
  res.json(await getActivity(portfolio.profile.github));
});

/* ---------- Contact form ---------- */

const MESSAGES_FILE = path.join(__dirname, 'data', 'messages.json');
const recentByIp = new Map();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Send the message by email with Resend (https://resend.com) when RESEND_API_KEY is set.
async function sendEmail(entry) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || 'Portfolio <onboarding@resend.dev>',
      to: [process.env.CONTACT_TO || portfolio.profile.email],
      reply_to: entry.email,
      subject: `Portfolio message from ${entry.name}`,
      text: `${entry.message}\n\n— ${entry.name} <${entry.email}>`,
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}

// Save to server/data/messages.json (works locally; Vercel's filesystem is read-only).
async function saveToFile(entry) {
  let all = [];
  try {
    all = JSON.parse(await fs.readFile(MESSAGES_FILE, 'utf8'));
  } catch {
    /* first message */
  }
  all.push(entry);
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(all, null, 2));
}

api.post('/contact', async (req, res) => {
  const now = Date.now();
  const ip = req.ip;
  const recent = (recentByIp.get(ip) || []).filter((t) => now - t < 60 * 60 * 1000);
  if (recent.length >= 5) {
    return res.status(429).json({ error: 'Too many messages — please try again in a bit.' });
  }

  const { name = '', email = '', message = '', company = '' } = req.body || {};

  // Honeypot: real people never fill the hidden "company" field.
  if (company) return res.status(201).json({ ok: true });

  const errors = {};
  if (String(name).trim().length < 2) errors.name = 'Tell me your name.';
  if (!EMAIL_RE.test(String(email).trim())) errors.email = 'That email looks off.';
  if (String(message).trim().length < 10) errors.message = 'A few more words, please (10+ characters).';
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const entry = {
    name: String(name).trim().slice(0, 120),
    email: String(email).trim().slice(0, 200),
    message: String(message).trim().slice(0, 5000),
    receivedAt: new Date().toISOString(),
  };

  try {
    if (process.env.RESEND_API_KEY) await sendEmail(entry);
    else if (!ON_VERCEL) await saveToFile(entry);
    else {
      // No way to deliver it from here — let the browser open the visitor's mail app instead.
      return res.status(503).json({ fallback: 'mailto', to: portfolio.profile.email });
    }
  } catch (err) {
    console.error('Could not deliver message:', err);
    return res.status(503).json({ fallback: 'mailto', to: portfolio.profile.email });
  }

  recent.push(now);
  recentByIp.set(ip, recent);
  console.log(`✉  New message from ${entry.name} <${entry.email}>`);
  res.status(201).json({ ok: true });
});

app.use('/api', api);
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

// On Vercel the function only ever receives API traffic; this also covers the case
// where the /api prefix has been stripped from the URL.
if (ON_VERCEL) app.use(api);

export default app;
