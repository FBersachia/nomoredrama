import express from 'express';
import path from 'node:path';
import cors from 'cors';
import compression from 'compression';
import { apiRouter } from './routes/index.js';
import { env } from './config/env.js';
import { sequelize } from './config/database.js';

export const app = express();

const allowedOrigins = env.corsOrigins;
app.use(
  cors({
    origin: allowedOrigins.includes('*')
      ? '*'
      : (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin);
            return;
          }
          callback(new Error('Not allowed by CORS'));
        }
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(compression({ level: 6 }));

// Serve static assets from Recursos (images, logo) so frontend URLs work in dev/prod
const recursosPath = path.resolve(process.cwd(), '../Recursos');
app.use('/Recursos', express.static(recursosPath));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    db: sequelize?.options?.database ?? 'unknown'
  });
});

app.use('/api/v1', apiRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[error]', err);
  if (res.headersSent) {
    return next(err);
  }
  const status =
    (err as any)?.status ||
    (err as any)?.statusCode ||
    ((err as Error).name === 'ZodError' ? 400 : 500);
  const message = (err as Error).message ?? 'Error interno';
  res.status(status).json({ message });
});
