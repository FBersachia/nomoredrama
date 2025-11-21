import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { loginAdmin, getAdminContent, upsertContent } from '../controllers/adminController.js';
import { requireAuth } from '../middlewares/auth.js';

export const adminRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Demasiados intentos, intenta mas tarde'
});

adminRouter.post('/login', loginLimiter, loginAdmin);
adminRouter.get('/content', requireAuth, getAdminContent);
adminRouter.put('/content', requireAuth, upsertContent);
