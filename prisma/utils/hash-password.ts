/**
 * パスワードハッシュ化ユーティリティ
 */

import bcrypt from 'bcryptjs';

/**
 * パスワードをハッシュ化
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * パスワードを検証
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

