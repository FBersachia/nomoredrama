import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { randomUUID } from 'crypto';
import { env } from '../config/env.js';
import { getContent, updateContent } from '../services/contentService.js';
import { validateAdminCredentials } from '../services/authService.js';
import { adminLoginSchema } from '../schemas/authSchemas.js';
import { addTokenToBlacklist } from '../utils/tokenBlacklist.js';

export async function loginAdmin(req: Request, res: Response): Promise<void> {
  const parsed = adminLoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Payload invalido', details: parsed.error.issues });
    return;
  }
  const { email, password } = parsed.data;

  try {
    const admin = await validateAdminCredentials(email, password);
    if (!admin) {
      res.status(401).json({ message: 'Credenciales invalidas' });
      return;
    }

    const token = jwt.sign(
      { sub: admin.id, email: admin.email, role: 'admin', jti: randomUUID() },
      env.jwtSecret,
      { expiresIn: '30m' }
    );
    res.json({ token });
  } catch (err) {
    console.error('[admin] login error', err);
    res.status(500).json({ message: 'Error al iniciar sesion' });
  }
}

export async function logoutAdmin(req: Request, res: Response): Promise<void> {
  const bearer = req.headers.authorization;
  const token = bearer?.startsWith('Bearer ') ? bearer.slice(7) : null;
  if (!token) {
    res.status(400).json({ message: 'Token requerido' });
    return;
  }
  try {
    const payload = jwt.verify(token, env.jwtSecret) as jwt.JwtPayload;
    if (payload.jti && payload.exp) {
      addTokenToBlacklist(payload.jti, payload.exp);
    }
    res.json({ message: 'Sesion cerrada' });
  } catch (err) {
    res.status(400).json({ message: 'Token invalido' });
  }
}

export async function getAdminContent(_req: Request, res: Response): Promise<void> {
  try {
    const content = await getContent();
    res.json(content);
  } catch (err) {
    console.error('[admin] get content error', err);
    res.status(500).json({ message: 'Error al obtener contenido' });
  }
}

export async function upsertContent(req: Request, res: Response): Promise<void> {
  try {
    await updateContent(req.body);
    res.json({ message: 'Contenido actualizado' });
  } catch (err: any) {
    console.error('[admin] upsert content error', err);
    if (err instanceof ZodError) {
      res.status(400).json({ message: 'Payload invalido', details: err.issues });
      return;
    }
    res.status(500).json({ message: 'Error al actualizar contenido' });
  }
}
