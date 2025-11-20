import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

// Example minimal models for MVP content. Extend as needed.

export interface BioAttributes {
  id: number;
  shortText: string;
  longText: string;
  heroImagePath: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type BioCreationAttributes = Optional<BioAttributes, 'id' | 'heroImagePath'>;

export class Bio extends Model<BioAttributes, BioCreationAttributes> implements BioAttributes {
  public id!: number;
  public shortText!: string;
  public longText!: string;
  public heroImagePath!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Bio.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    shortText: { type: DataTypes.TEXT, allowNull: false },
    longText: { type: DataTypes.TEXT, allowNull: false },
    heroImagePath: { type: DataTypes.STRING, allowNull: true }
  },
  { sequelize, tableName: 'bios', modelName: 'Bio' }
);

// Add other models (Visual, Set, Collaboration, Influence, Contact, AdminUser) following this pattern.

export async function syncModels(): Promise<void> {
  await sequelize.sync({ alter: true });
}
