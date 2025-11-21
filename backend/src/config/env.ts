import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3001),
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  corsOrigins:
    (process.env.CORS_ORIGIN ?? '*')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
  logLevel: process.env.LOG_LEVEL ?? 'info'
};

if (env.port !== 3001) {
  throw new Error('[env] PORT must be 3001 for this project.');
}

if (!env.databaseUrl) {
  console.warn('[env] DATABASE_URL is not set.');
}

if (!env.jwtSecret) {
  console.warn('[env] JWT_SECRET is not set.');
}
