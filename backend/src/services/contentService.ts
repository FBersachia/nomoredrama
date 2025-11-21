import { z } from 'zod';
import { Op } from 'sequelize';
import { sequelize } from '../config/database.js';
import {
  Bio,
  Visual,
  LiveSet,
  Collaboration,
  Influence,
  Contact
} from '../models/index.js';
import { contentSchema } from '../schemas/contentSchemas.js';

export type ContentInput = z.infer<typeof contentSchema>;

export async function getContent() {
  const [bio, visuals, sets, collaborations, influences, contact] = await Promise.all([
    Bio.findOne(),
    Visual.findAll({ order: [['order', 'ASC'], ['id', 'ASC']] }),
    LiveSet.findAll({ order: [['order', 'ASC'], ['id', 'ASC']] }),
    Collaboration.findAll({ order: [['order', 'ASC'], ['id', 'ASC']] }),
    Influence.findAll({ order: [['order', 'ASC'], ['id', 'ASC']] }),
    Contact.findOne()
  ]);

  return {
    bio: bio ? bio.get({ plain: true }) : null,
    visuals: visuals.map((v) => v.get({ plain: true })),
    sets: sets.map((s) => s.get({ plain: true })),
    collaborations: collaborations.map((c) => c.get({ plain: true })),
    influences: influences.map((i) => i.get({ plain: true })),
    contact: contact ? contact.get({ plain: true }) : null
  };
}

export async function updateContent(rawData: unknown) {
  const data = contentSchema.parse(rawData);
  const transaction = await sequelize.transaction();

  try {
    if (data.bio) {
      await Bio.upsert(
        {
          id: 1,
          shortText: data.bio.shortText,
          longText: data.bio.longText,
          heroImagePath: data.bio.heroImagePath ?? null
        },
        { transaction }
      );
    }

    if (data.visuals) {
      const ids = data.visuals.map((v) => v.id).filter(Boolean) as number[];
      await Visual.destroy({
        where: ids.length ? { id: { [Op.notIn]: ids } } : {},
        transaction
      });
      await Visual.bulkCreate(
        data.visuals.map((v, idx) => ({
          id: v.id,
          title: v.title,
          description: v.description ?? null,
          imagePath: v.imagePath,
          order: v.order ?? idx + 1
        })),
        {
          transaction,
          updateOnDuplicate: ['title', 'description', 'imagePath', 'order', 'updatedAt']
        }
      );
    }

    if (data.sets) {
      const ids = data.sets.map((s) => s.id).filter(Boolean) as number[];
      await LiveSet.destroy({
        where: ids.length ? { id: { [Op.notIn]: ids } } : {},
        transaction
      });
      await LiveSet.bulkCreate(
        data.sets.map((s, idx) => ({
          id: s.id,
          title: s.title,
          description: s.description ?? null,
          embedUrl: s.embedUrl,
          platform: (s.platform ?? 'youtube') as 'youtube' | 'vimeo',
          order: s.order ?? idx + 1
        })),
        {
          transaction,
          updateOnDuplicate: ['title', 'description', 'embedUrl', 'platform', 'order', 'updatedAt']
        }
      );
    }

    if (data.collaborations) {
      const ids = data.collaborations.map((c) => c.id).filter(Boolean) as number[];
      await Collaboration.destroy({
        where: ids.length ? { id: { [Op.notIn]: ids } } : {},
        transaction
      });
      await Collaboration.bulkCreate(
        data.collaborations.map((c, idx) => ({
          id: c.id,
          name: c.name,
          role: c.role ?? null,
          year: c.year ?? null,
          link: c.link ?? null,
          order: c.order ?? idx + 1
        })),
        {
          transaction,
          updateOnDuplicate: ['name', 'role', 'year', 'link', 'order', 'updatedAt']
        }
      );
    }

    if (data.influences) {
      const ids = data.influences.map((i) => i.id).filter(Boolean) as number[];
      await Influence.destroy({
        where: ids.length ? { id: { [Op.notIn]: ids } } : {},
        transaction
      });
      await Influence.bulkCreate(
        data.influences.map((i, idx) => ({
          id: i.id,
          name: i.name,
          genre: i.genre ?? null,
          note: i.note ?? null,
          order: i.order ?? idx + 1
        })),
        {
          transaction,
          updateOnDuplicate: ['name', 'genre', 'note', 'order', 'updatedAt']
        }
      );
    }

    if (data.contact) {
      await Contact.upsert(
        {
          id: 1,
          whatsappNumber: data.contact.whatsappNumber,
          whatsappMessage: data.contact.whatsappMessage ?? null,
          instagram: data.contact.instagram ?? null,
          spotify: data.contact.spotify ?? null,
          youtube: data.contact.youtube ?? null,
          soundcloud: data.contact.soundcloud ?? null,
          email: data.contact.email ?? null,
          location: data.contact.location ?? null
        },
        { transaction }
      );
    }

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}
