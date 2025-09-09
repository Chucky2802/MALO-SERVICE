// index.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import path from 'path';

import { adminRouter } from './Routes/AdminRoutes.js';
import { categoryRouter } from './Routes/CategoryRoutes.js';
import { customerRouter } from './Routes/CustomerRoutes.js';
import { employeeRouter } from './Routes/EmployeeRoutes.js';
import { serviceRouter } from './Routes/ServiceRoutes.js';

// Allow common dev ports by default; can override via CORS_ORIGINS in .env (comma-separated)
const DEFAULT_ORIGINS = [
  'http://localhost:3000', // CRA
  'http://localhost:3001', // your earlier UI
  'http://localhost:5173'  // Vite
];
const fromEnv = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const allowedOrigins = fromEnv.length ? fromEnv : DEFAULT_ORIGINS;

const app = express();

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use(cookieParser());
app.use(express.json());

// Serve uploaded images: /images/<filename> -> Public/Images/<filename>
app.use('/images', express.static(path.join(process.cwd(), 'Public', 'Images')));

// Basic health probe
app.get('/', (_req, res) => res.json({ ok: true }));

// Routers
app.use('/auth', adminRouter);
app.use('/', categoryRouter);
app.use('/', customerRouter);
app.use('/', employeeRouter);
app.use('/', serviceRouter);

// 404
app.use((req, res) => res.status(404).json({ ok: false, error: 'Not found' }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ ok: false, error: 'Internal server error' });
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS allowed origins: ${allowedOrigins.join(', ') || '(none)'}`);
});

export default app;
