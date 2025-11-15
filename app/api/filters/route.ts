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
    
    // データベース接続エラーの検出
    const isDatabaseError = 
      errorMessage.includes('Can\'t reach database server') ||
      errorMessage.includes('P1001') ||
      errorMessage.includes('P2002') ||
      errorMessage.includes('connection') ||
      errorMessage.includes('ECONNREFUSED') ||
      errorMessage.includes('timeout');
    
    logError(error instanceof Error ? error : new Error('Unknown error'), {
      endpoint: '/api/filters',
      method: 'GET',
      errorMessage,
      errorStack,
      isDatabaseError,
      databaseUrl: process.env.DATABASE_URL ? '設定済み' : '未設定',
    });

    const friendlyMessage = getUserFriendlyMessage(
      error instanceof Error ? error : new Error('Unknown error')
    );

    // リモート環境でも詳細なエラーメッセージを返す（デバッグ用）
    const isProduction = process.env.NODE_ENV === 'production';
    const shouldShowDetails = !isProduction || process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development';

    return NextResponse.json(
      { 
        error: friendlyMessage,
        code: error instanceof ApplicationError ? error.code : (isDatabaseError ? ErrorCode.DATABASE_ERROR : ErrorCode.INTERNAL_SERVER_ERROR),
        details: shouldShowDetails ? errorMessage : undefined,
        type: isDatabaseError ? 'database_connection_error' : 'unknown_error',
      },
      { status: 500 }
    );
  }
}

