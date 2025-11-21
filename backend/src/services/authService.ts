import bcrypt from 'bcryptjs';
import { AdminUser } from '../models/index.js';

export async function validateAdminCredentials(email: string, password: string) {
  const admin = await AdminUser.findOne({ where: { email } });
  if (!admin) return null;

  const passwordHash = admin.getDataValue('passwordHash');
  const isValid = await bcrypt.compare(password, passwordHash);
  if (!isValid) return null;

  return admin;
}
