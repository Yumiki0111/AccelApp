import { NextRequest, NextResponse } from 'next/server';
import { PrismaCompanyRepository } from '../../../../../src/infrastructure/repositories/PrismaCompanyRepository';
import { GetOrganizationBrowsedCompaniesUseCase } from '../../../../../src/application/use-cases/GetOrganizationBrowsedCompaniesUseCase';
import { requireOrganizationUser } from '../../../../../lib/auth/middleware-helpers';
import { logError, getUserFriendlyMessage, ErrorCode, ApplicationError } from '../../../../../lib/errors/error-handler';

const companyRepository = new PrismaCompanyRepository();
const getOrganizationBrowsedCompaniesUseCase = new GetOrganizationBrowsedCompaniesUseCase(companyRepository);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 認証チェック（組織ユーザーのみ）
    const user = await requireOrganizationUser(request);

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: '組織IDが指定されていません' },
        { status: 400 }
      );
    }

    // 認可チェック：自分の組織のデータのみアクセス可能
    if (user.organizationId !== id) {
      return NextResponse.json(
        { error: 'この組織のデータにアクセスする権限がありません' },
        { status: 403 }
      );
    }

    const browsedCompanies = await getOrganizationBrowsedCompaniesUseCase.execute(id);

    return NextResponse.json(browsedCompanies, { status: 200 });
  } catch (error) {
    let organizationId: string | undefined;
    try {
      const { id } = await params;
      organizationId = id;
    } catch {
      // params取得に失敗した場合はスキップ
    }

    logError(error instanceof Error ? error : new Error('Unknown error'), {
      endpoint: '/api/organizations/[id]/history',
      method: 'GET',
      organizationId: organizationId || 'unknown',
    });

    const friendlyMessage = getUserFriendlyMessage(
      error instanceof Error ? error : new Error('Unknown error')
    );

    const statusCode = error instanceof ApplicationError
      ? (error.code === ErrorCode.AUTHENTICATION_REQUIRED ? 401
        : error.code === ErrorCode.AUTHORIZATION_FAILED || error.code === ErrorCode.INSUFFICIENT_PERMISSIONS ? 403
        : 500)
      : (error instanceof Error && error.message.includes('認証') ? 401
        : 500);

    return NextResponse.json(
      { 
        error: friendlyMessage,
        code: error instanceof ApplicationError ? error.code : ErrorCode.INTERNAL_SERVER_ERROR,
      },
      { status: statusCode }
    );
  }
}

