import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No autorizado' });
    return;
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.jwtSecret) as { sub: string; role?: string };
    (req as Request & { user?: typeof payload }).user = payload;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
}
