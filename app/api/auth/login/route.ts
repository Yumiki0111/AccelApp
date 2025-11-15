import { NextRequest, NextResponse } from 'next/server';
import { PrismaAuthRepository } from '../../../../src/infrastructure/repositories/PrismaAuthRepository';
import { LoginUseCase } from '../../../../src/application/use-cases/LoginUseCase';
import { setSessionToken } from '../../../../lib/auth/session';
import { logError, getUserFriendlyMessage, ErrorCode, ApplicationError } from '../../../../lib/errors/error-handler';

const authRepository = new PrismaAuthRepository();
const loginUseCase = new LoginUseCase(authRepository);

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      logError(parseError instanceof Error ? parseError : new Error('Parse error'), {
        endpoint: '/api/auth/login',
        method: 'POST',
        errorType: 'parse_error',
      });
      return NextResponse.json(
        { 
          error: getUserFriendlyMessage(parseError instanceof Error ? parseError : new Error('Parse error')),
          code: ErrorCode.VALIDATION_ERROR,
        },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードを入力してください' },
        { status: 400 }
      );
    }

    console.log('ログイン試行:', { email });

    const result = await loginUseCase.execute(email, password);

    console.log('ログイン成功:', { userId: result.user.id });

    // セッショントークンをCookieに設定
    try {
      await setSessionToken(result.sessionToken);
    } catch (cookieError) {
      console.error('Cookie設定エラー:', cookieError);
      // Cookie設定に失敗してもログインは成功とする（セッションは作成済み）
    }

    return NextResponse.json(
      {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          userType: result.user.userType,
          organizationId: result.user.organizationId,
          companyId: result.user.companyId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    logError(error instanceof Error ? error : new Error('Unknown error'), {
      endpoint: '/api/auth/login',
      method: 'POST',
    });

    const friendlyMessage = getUserFriendlyMessage(
      error instanceof Error ? error : new Error('Unknown error')
    );

    const statusCode = error instanceof ApplicationError
      ? (error.code === ErrorCode.AUTHENTICATION_FAILED || error.code === ErrorCode.VALIDATION_ERROR ? 401 : 500)
      : 401;

    return NextResponse.json(
      { 
        error: friendlyMessage,
        code: error instanceof ApplicationError ? error.code : ErrorCode.INTERNAL_SERVER_ERROR,
      },
      { status: statusCode }
    );
  }
}
