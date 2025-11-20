import { Sequelize } from 'sequelize';
import { env } from './env.js';

export const sequelize = new Sequelize(env.databaseUrl, {
  logging: env.nodeEnv === 'development' ? console.log : false,
  dialectOptions: {
    ssl: env.nodeEnv === 'production' ? { require: true, rejectUnauthorized: false } : undefined
  }
});

export async function initDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.info('[db] Connection established');
  } catch (err) {
    console.error('[db] Unable to connect:', err);
    throw err;
  }
}
