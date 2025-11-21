import { z } from 'zod';

export const bioSchema = z.object({
  shortText: z.string().min(1),
  longText: z.string().min(1),
  heroImagePath: z.string().optional().nullable()
});

export const contentSchema = z.object({
  bio: bioSchema.optional(),
  visuals: z.array(
    z.object({
      id: z.number().int().optional(),
      title: z.string().min(1),
      description: z.string().optional(),
      imagePath: z.string().min(1),
      order: z.number().int().optional()
    })
  ).optional(),
  sets: z.array(
    z.object({
      id: z.number().int().optional(),
      title: z.string().min(1),
      description: z.string().optional(),
      embedUrl: z.string().url(),
      platform: z.enum(['youtube', 'vimeo']).optional(),
      order: z.number().int().optional()
    })
  ).optional(),
  collaborations: z.array(
    z.object({
      id: z.number().int().optional(),
      name: z.string().min(1),
      role: z.string().optional(),
      year: z.number().int().optional(),
      link: z.string().url().optional(),
      order: z.number().int().optional()
    })
  ).optional(),
  influences: z.array(
    z.object({
      id: z.number().int().optional(),
      name: z.string().min(1),
      genre: z.string().optional(),
      note: z.string().optional(),
      order: z.number().int().optional()
    })
  ).optional(),
  contact: z
    .object({
      whatsappNumber: z.string().min(5),
      whatsappMessage: z.string().optional(),
      instagram: z.string().url().optional(),
      spotify: z.string().url().optional(),
      youtube: z.string().url().optional(),
      soundcloud: z.string().url().optional(),
      email: z.string().email().optional(),
      location: z.string().optional()
    })
    .optional()
});
