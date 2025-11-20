import { Request, Response } from 'express';
import { Bio } from '../models/index.js';

export async function getPublicContent(_req: Request, res: Response): Promise<void> {
  // For MVP: return bio and empty arrays as placeholders.
  try {
    const bio = await Bio.findOne();
    res.json({
      bio,
      visuals: [],
      sets: [],
      collaborations: [],
      influences: [],
      contact: null
    });
  } catch (err) {
    console.error('[content] getPublicContent', err);
    res.status(500).json({ message: 'Error al obtener contenido' });
  }
}
