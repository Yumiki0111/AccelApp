import { NextRequest, NextResponse } from 'next/server';
import { SearchCompaniesUseCase } from '../../../src/application/use-cases/SearchCompaniesUseCase';
import { PrismaCompanyRepository } from '../../../src/infrastructure/repositories/PrismaCompanyRepository';
import { logError, getUserFriendlyMessage, ErrorCode, ApplicationError } from '../../../lib/errors/error-handler';

const companyRepository = new PrismaCompanyRepository();
const searchCompaniesUseCase = new SearchCompaniesUseCase(companyRepository);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // クエリパラメータの取得
    const keyword = searchParams.get('keyword') || undefined;
    const industries = searchParams.getAll('industries[]');
    const sponsorshipTypes = searchParams.getAll('sponsorshipTypes[]');
    const regions = searchParams.getAll('regions[]');
    const sortBy = (searchParams.get('sort') as 'rating' | 'new' | 'reviewCount') || 'rating';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const params = {
      keyword,
      industryTags: industries.length > 0 ? industries : undefined,
      sponsorshipTypes: sponsorshipTypes.length > 0 ? sponsorshipTypes : undefined,
      regions: regions.length > 0 ? regions : undefined,
      sortBy,
      page,
      limit,
    };

    const result = await searchCompaniesUseCase.execute(params);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    logError(error instanceof Error ? error : new Error('Unknown error'), {
      endpoint: '/api/companies',
      method: 'GET',
      errorMessage,
      errorStack,
    });

    const friendlyMessage = getUserFriendlyMessage(
      error instanceof Error ? error : new Error('Unknown error')
    );

    return NextResponse.json(
      { 
        error: friendlyMessage,
        code: error instanceof ApplicationError ? error.code : ErrorCode.INTERNAL_SERVER_ERROR,
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: error instanceof ApplicationError && error.code === ErrorCode.VALIDATION_ERROR ? 400 : 500 }
    );
  }
}

