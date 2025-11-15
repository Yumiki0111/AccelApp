/**
 * セッション管理ユーティリティ
 */

import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'session_token';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30日間

/**
 * セッショントークンをCookieに設定
 */
export async function setSessionToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

/**
 * セッショントークンをCookieから取得
 */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value || null;
}

/**
 * セッショントークンをCookieから削除
 */
export async function deleteSessionToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

