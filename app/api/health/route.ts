import { NextResponse } from 'next/server';
import { prisma } from '../../../src/infrastructure/database/prisma';

/**
 * ヘルスチェックエンドポイント
 * データベース接続の確認に使用
 */
export async function GET() {
  try {
    // 環境変数の確認
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    
    if (!hasDatabaseUrl) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'DATABASE_URL環境変数が設定されていません',
          database: {
            connected: false,
            url: '未設定',
          },
        },
        { status: 500 }
      );
    }

    // データベース接続の確認
    try {
      await prisma.$queryRaw`SELECT 1`;
      
      return NextResponse.json(
        {
          status: 'ok',
          message: 'データベース接続正常',
          database: {
            connected: true,
            url: process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@') || '設定済み',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    } catch (dbError) {
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown error';
      
      return NextResponse.json(
        {
          status: 'error',
          message: 'データベース接続エラー',
          database: {
            connected: false,
            url: process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@') || '設定済み',
            error: errorMessage,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'ヘルスチェックエラー',
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

