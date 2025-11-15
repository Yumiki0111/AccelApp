import { NextRequest, NextResponse } from 'next/server';
import { PrismaAuthRepository } from '../../../../src/infrastructure/repositories/PrismaAuthRepository';
import { GetSessionUseCase } from '../../../../src/application/use-cases/GetSessionUseCase';
import { getSessionToken } from '../../../../lib/auth/session';
import { logError } from '../../../../lib/errors/error-handler';

const authRepository = new PrismaAuthRepository();
const getSessionUseCase = new GetSessionUseCase(authRepository);

export async function GET(request: NextRequest) {
  try {
    const sessionToken = await getSessionToken();

    if (!sessionToken) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await getSessionUseCase.execute(sessionToken);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.userType,
          organizationId: user.organizationId,
          companyId: user.companyId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    logError(error instanceof Error ? error : new Error('Unknown error'), {
      endpoint: '/api/auth/session',
      method: 'GET',
    });
    // セッション取得エラーはnullを返す（認証されていない状態として扱う）
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

