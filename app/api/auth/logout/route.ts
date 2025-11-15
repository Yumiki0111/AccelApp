import { NextRequest, NextResponse } from 'next/server';
import { PrismaAuthRepository } from '../../../../src/infrastructure/repositories/PrismaAuthRepository';
import { LogoutUseCase } from '../../../../src/application/use-cases/LogoutUseCase';
import { getSessionToken, deleteSessionToken } from '../../../../lib/auth/session';
import { logError, getUserFriendlyMessage, ErrorCode, ApplicationError } from '../../../../lib/errors/error-handler';

const authRepository = new PrismaAuthRepository();
const logoutUseCase = new LogoutUseCase(authRepository);

export async function POST(request: NextRequest) {
  try {
    const sessionToken = await getSessionToken();

    if (sessionToken) {
      await logoutUseCase.execute(sessionToken);
    }

    // Cookieを削除
    await deleteSessionToken();

    return NextResponse.json({ message: 'ログアウトしました' }, { status: 200 });
  } catch (error) {
    logError(error instanceof Error ? error : new Error('Unknown error'), {
      endpoint: '/api/auth/logout',
      method: 'POST',
    });

    // エラーが発生してもCookieは削除
    await deleteSessionToken();

    const friendlyMessage = getUserFriendlyMessage(
      error instanceof Error ? error : new Error('Unknown error')
    );

    return NextResponse.json(
      {
        error: friendlyMessage,
        code: error instanceof ApplicationError ? error.code : ErrorCode.INTERNAL_SERVER_ERROR,
      },
      { status: 500 }
    );
  }
}

