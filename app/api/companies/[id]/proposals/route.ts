import { NextRequest, NextResponse } from 'next/server';
import { PrismaProposalRepository } from '../../../../../src/infrastructure/repositories/PrismaProposalRepository';
import { SubmitProposalUseCase } from '../../../../../src/application/use-cases/SubmitProposalUseCase';
import { requireOrganizationUser } from '../../../../../lib/auth/middleware-helpers';
import { logError, getUserFriendlyMessage, ErrorCode, ApplicationError } from '../../../../../lib/errors/error-handler';

const proposalRepository = new PrismaProposalRepository();
const submitProposalUseCase = new SubmitProposalUseCase(proposalRepository);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 認証チェック（組織ユーザーのみ）
    const user = await requireOrganizationUser(request);

    const { id: companyId } = await params;
    const body = await request.json();

    const { organizationId, planId, message } = body;

    // 認可チェック：自分の組織のデータのみアクセス可能
    if (organizationId && user.organizationId !== organizationId) {
      return NextResponse.json(
        { error: 'この組織のデータにアクセスする権限がありません' },
        { status: 403 }
      );
    }

    // organizationIdとsubmittedByUserIdは認証情報から取得
    const finalOrganizationId = organizationId || user.organizationId;
    const submittedByUserId = user.id;

    if (!finalOrganizationId) {
      return NextResponse.json(
        { error: '組織IDが指定されていません' },
        { status: 400 }
      );
    }
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'メッセージが指定されていません' },
        { status: 400 }
      );
    }

    const proposal = await submitProposalUseCase.execute({
      organizationId: finalOrganizationId,
      companyId,
      planId,
      message,
      submittedByUserId,
    });

    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    let companyId: string | undefined;
    try {
      const { id } = await params;
      companyId = id;
    } catch {
      // params取得に失敗した場合はスキップ
    }

    logError(error instanceof Error ? error : new Error('Unknown error'), {
      endpoint: '/api/companies/[id]/proposals',
      method: 'POST',
      companyId: companyId || 'unknown',
    });

    const friendlyMessage = getUserFriendlyMessage(
      error instanceof Error ? error : new Error('Unknown error')
    );

    const statusCode = error instanceof ApplicationError
      ? (error.code === ErrorCode.AUTHENTICATION_REQUIRED ? 401
        : error.code === ErrorCode.AUTHORIZATION_FAILED || error.code === ErrorCode.INSUFFICIENT_PERMISSIONS ? 403
        : error.code === ErrorCode.VALIDATION_ERROR ? 400
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

