import { NextRequest, NextResponse } from 'next/server';
import { ViewCompanyDetailUseCase } from '../../../../src/application/use-cases/ViewCompanyDetailUseCase';
import { PrismaCompanyRepository } from '../../../../src/infrastructure/repositories/PrismaCompanyRepository';
import { logError, getUserFriendlyMessage, ErrorCode, ApplicationError } from '../../../../lib/errors/error-handler';

const companyRepository = new PrismaCompanyRepository();
const viewCompanyDetailUseCase = new ViewCompanyDetailUseCase(companyRepository);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let companyId: string | undefined;
  try {
    const { id } = await params;
    companyId = id;

    if (!id) {
      return NextResponse.json(
        { error: '企業IDが指定されていません' },
        { status: 400 }
      );
    }

    const company = await viewCompanyDetailUseCase.execute(id);

    if (!company) {
      return NextResponse.json(
        { error: '企業が見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    logError(error instanceof Error ? error : new Error('Unknown error'), {
      endpoint: '/api/companies/[id]',
      method: 'GET',
      companyId: companyId || 'unknown',
    });

    const friendlyMessage = getUserFriendlyMessage(
      error instanceof Error ? error : new Error('Unknown error')
    );

    return NextResponse.json(
      { 
        error: friendlyMessage,
        code: error instanceof ApplicationError ? error.code : ErrorCode.INTERNAL_SERVER_ERROR,
      },
      { status: error instanceof ApplicationError && error.code === ErrorCode.RESOURCE_NOT_FOUND ? 404 : 500 }
    );
  }
}

