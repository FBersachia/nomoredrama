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

if (env.nodeEnv === 'production' && env.corsOrigins.includes('*')) {
  throw new Error('[env] CORS_ORIGIN cannot contain "*" in production.');
}

if (!env.databaseUrl) {
  if (env.nodeEnv === 'production') {
    throw new Error('[env] DATABASE_URL is required.');
  }
  console.warn('[env] DATABASE_URL is not set.');
}

if (!env.jwtSecret || env.jwtSecret.length < 16) {
  if (env.nodeEnv === 'production') {
    throw new Error('[env] JWT_SECRET is required and must be at least 16 characters.');
  }
  console.warn('[env] JWT_SECRET is not set or too short.');
}
