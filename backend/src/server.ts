import { app } from './app.js';
import { env } from './config/env.js';
import { initDatabase } from './config/database.js';

async function bootstrap(): Promise<void> {
  await initDatabase();
  const port = env.port;
  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
