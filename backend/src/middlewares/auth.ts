import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/index.js';
import { env } from '../config/env.js';

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No autorizado' });
    return;
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.jwtSecret) as { sub: string | number; role?: string; email?: string };
    const adminId = Number(payload.sub);
    if (!payload.role || payload.role !== 'admin' || Number.isNaN(adminId)) {
      res.status(401).json({ message: 'Token invalido' });
      return;
    }
    const admin = await AdminUser.findByPk(adminId);
    if (!admin) {
      res.status(401).json({ message: 'Usuario no encontrado' });
      return;
    }
    (req as Request & { user?: typeof payload }).user = payload;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalido' });
  }
}
