import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // 環境変数のチェック
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'Supabase環境変数が設定されていません',
          timestamp: new Date().toISOString(),
          environment: {
            hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          },
        },
        { status: 500 }
      );
    }

    const results: {
      clientConnection: boolean;
      adminConnection: boolean;
      clientError?: string;
      adminError?: string;
      timestamp: string;
    } = {
      clientConnection: false,
      adminConnection: false,
      timestamp: new Date().toISOString(),
    };

    // クライアント側接続テスト（匿名キー）
    // Supabaseの接続をテストするために、簡単なクエリを実行
    try {
      // 存在しない可能性のあるテーブルにクエリを送信
      // 接続エラーとテーブル不存在エラーを区別する
      const { error } = await supabase.from('_test_connection').select('*').limit(0);
      
      if (error) {
        // エラーコードで接続状態を判断
        // PGRST116: リレーションが存在しない（接続は成功）
        // 42P01: PostgreSQLのリレーション不存在エラー（接続は成功）
        if (
          error.code === 'PGRST116' ||
          error.code === '42P01' ||
          error.message.includes('relation') ||
          error.message.includes('does not exist') ||
          error.message.includes('Could not find')
        ) {
          results.clientConnection = true;
        } else {
          // 認証エラーや接続エラーの場合
          results.clientError = `${error.code || 'Unknown'}: ${error.message}`;
        }
      } else {
        results.clientConnection = true;
      }
    } catch (error) {
      results.clientError = error instanceof Error ? error.message : 'Unknown error';
    }

    // サーバー側接続テスト（サービスロールキー）
    if (supabaseAdmin) {
      try {
        const { error } = await supabaseAdmin.from('_test_connection').select('*').limit(0);
        
        if (error) {
          if (
            error.code === 'PGRST116' ||
            error.code === '42P01' ||
            error.message.includes('relation') ||
            error.message.includes('does not exist') ||
            error.message.includes('Could not find')
          ) {
            results.adminConnection = true;
          } else {
            results.adminError = `${error.code || 'Unknown'}: ${error.message}`;
          }
        } else {
          results.adminConnection = true;
        }
      } catch (error) {
        results.adminError = error instanceof Error ? error.message : 'Unknown error';
      }
    } else {
      results.adminError = 'Service role key not configured';
    }

    return NextResponse.json({
      success: results.clientConnection && (results.adminConnection || !supabaseAdmin),
      ...results,
      environment: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

