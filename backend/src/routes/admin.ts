import { Router } from 'express';
import { loginAdmin, getAdminContent, upsertContent } from '../controllers/adminController.js';
import { requireAuth } from '../middlewares/auth.js';

export const adminRouter = Router();

adminRouter.post('/login', loginAdmin);
adminRouter.get('/content', requireAuth, getAdminContent);
adminRouter.put('/content', requireAuth, upsertContent);
