/**
 * 認証・認可ヘルパー関数
 */

import { NextRequest } from 'next/server';
import { getSessionToken } from './session';
import { GetSessionUseCase } from '../../src/application/use-cases/GetSessionUseCase';
import { PrismaAuthRepository } from '../../src/infrastructure/repositories/PrismaAuthRepository';

const authRepository = new PrismaAuthRepository();
const getSessionUseCase = new GetSessionUseCase(authRepository);

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  userType: 'company' | 'organization';
  organizationId?: string | null;
  companyId?: string | null;
}

/**
 * リクエストから認証されたユーザーを取得
 */
export async function getAuthenticatedUser(
  request: NextRequest
): Promise<AuthenticatedUser | null> {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return null;
  }

  const user = await getSessionUseCase.execute(sessionToken);

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    userType: user.userType,
    organizationId: user.organizationId,
    companyId: user.companyId,
  };
}

/**
 * 組織ユーザーのみアクセス可能かチェック
 */
export async function requireOrganizationUser(
  request: NextRequest
): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    throw new Error('認証が必要です');
  }

  if (user.userType !== 'organization') {
    throw new Error('この操作は組織ユーザーのみ実行可能です');
  }

  if (!user.organizationId) {
    throw new Error('組織情報が見つかりません');
  }

  return user;
}

/**
 * 企業ユーザーのみアクセス可能かチェック
 */
export async function requireCompanyUser(
  request: NextRequest
): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    throw new Error('認証が必要です');
  }

  if (user.userType !== 'company') {
    throw new Error('この操作は企業ユーザーのみ実行可能です');
  }

  if (!user.companyId) {
    throw new Error('企業情報が見つかりません');
  }

  return user;
}

