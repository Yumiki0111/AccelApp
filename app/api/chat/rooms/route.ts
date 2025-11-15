import { NextRequest, NextResponse } from 'next/server';
import { PrismaChatRepository } from '../../../../src/infrastructure/repositories/PrismaChatRepository';
import { GetChatRoomsUseCase } from '../../../../src/application/use-cases/GetChatRoomsUseCase';
import { getAuthenticatedUser } from '../../../../lib/auth/middleware-helpers';
import { logError, getUserFriendlyMessage, ErrorCode, ApplicationError } from '../../../../lib/errors/error-handler';

const chatRepository = new PrismaChatRepository();
const getChatRoomsUseCase = new GetChatRoomsUseCase(chatRepository);

export async function GET(request: NextRequest) {
  try {
    // 認証チェック
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get('organizationId') || undefined;
    const companyId = searchParams.get('companyId') || undefined;

    if (!organizationId && !companyId) {
      return NextResponse.json(
        { error: '組織IDまたは企業IDが指定されていません' },
        { status: 400 }
      );
    }

    // 認可チェック：自分の組織/企業のデータのみアクセス可能
    if (organizationId && user.userType === 'organization' && user.organizationId !== organizationId) {
      return NextResponse.json(
        { error: 'この組織のデータにアクセスする権限がありません' },
        { status: 403 }
      );
    }

    if (companyId && user.userType === 'company' && user.companyId !== companyId) {
      return NextResponse.json(
        { error: 'この企業のデータにアクセスする権限がありません' },
        { status: 403 }
      );
    }

    const rooms = await getChatRoomsUseCase.execute(organizationId, companyId);

    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    logError(error instanceof Error ? error : new Error('Unknown error'), {
      endpoint: '/api/chat/rooms',
      method: 'GET',
    });

    const friendlyMessage = getUserFriendlyMessage(
      error instanceof Error ? error : new Error('Unknown error')
    );

    const statusCode = error instanceof ApplicationError
      ? (error.code === ErrorCode.AUTHENTICATION_REQUIRED ? 401
        : error.code === ErrorCode.AUTHORIZATION_FAILED || error.code === ErrorCode.INSUFFICIENT_PERMISSIONS ? 403
        : 500)
      : 500;

    return NextResponse.json(
      { 
        error: friendlyMessage,
        code: error instanceof ApplicationError ? error.code : ErrorCode.INTERNAL_SERVER_ERROR,
      },
      { status: statusCode }
    );
  }
}

