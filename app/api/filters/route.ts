import { NextResponse } from 'next/server';
import { LoadFiltersUseCase } from '../../../src/application/use-cases/LoadFiltersUseCase';
import { PrismaTagRepository } from '../../../src/infrastructure/repositories/PrismaTagRepository';
import { PrismaRegionRepository } from '../../../src/infrastructure/repositories/PrismaRegionRepository';
import { logError, getUserFriendlyMessage, ErrorCode, ApplicationError } from '../../../lib/errors/error-handler';

const tagRepository = new PrismaTagRepository();
const regionRepository = new PrismaRegionRepository();
const loadFiltersUseCase = new LoadFiltersUseCase(tagRepository, regionRepository);

export async function GET() {
  try {
    const filters = await loadFiltersUseCase.execute();

    return NextResponse.json(filters, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    logError(error instanceof Error ? error : new Error('Unknown error'), {
      endpoint: '/api/filters',
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
      { status: 500 }
    );
  }
}

