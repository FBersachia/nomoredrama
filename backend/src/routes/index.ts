import { Router } from 'express';
import { contentRouter } from './content.js';
import { adminRouter } from './admin.js';

export const apiRouter = Router();

apiRouter.use('/content', contentRouter);
apiRouter.use('/admin', adminRouter);
