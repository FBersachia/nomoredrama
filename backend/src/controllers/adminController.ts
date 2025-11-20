import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { Bio } from '../models/index.js';

const DEMO_ADMIN = {
  email: 'admin@example.com',
  passwordHash: bcrypt.hashSync('changeme', 8)
};

export async function loginAdmin(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ message: 'Email y password requeridos' });
    return;
  }

  if (email !== DEMO_ADMIN.email || !bcrypt.compareSync(password, DEMO_ADMIN.passwordHash)) {
    res.status(401).json({ message: 'Credenciales inválidas' });
    return;
  }

  const token = jwt.sign({ sub: email, role: 'admin' }, env.jwtSecret, { expiresIn: '8h' });
  res.json({ token });
}

export async function getAdminContent(_req: Request, res: Response): Promise<void> {
  const bio = await Bio.findOne();
  res.json({ bio, visuals: [], sets: [], collaborations: [], influences: [], contact: null });
}

export async function upsertContent(req: Request, res: Response): Promise<void> {
  const { bio } = req.body as { bio?: Partial<Bio> };
  if (bio) {
    await Bio.upsert({
      id: 1,
      shortText: bio.shortText ?? '',
      longText: bio.longText ?? '',
      heroImagePath: bio.heroImagePath ?? null
    });
  }
  res.json({ message: 'Contenido actualizado' });
}
