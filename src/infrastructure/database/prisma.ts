import { PrismaClient } from '@prisma/client';

// Prismaクライアントのシングルトンインスタンス
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// データベース接続URLを取得
const databaseUrl = process.env.DATABASE_URL;

// Supabase接続かどうかを判定（URLにsupabase.coが含まれている場合）
const isSupabase = databaseUrl?.includes('supabase.co') || databaseUrl?.includes('pooler.supabase.com');

// Prismaクライアントの設定
const prismaConfig: {
  log: ('query' | 'error' | 'warn')[];
  datasources?: {
    db: {
      url: string;
    };
  };
} = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
};

// Supabase接続の場合、接続プールの設定を最適化
if (isSupabase) {
  // Supabaseの接続プールを使用する場合の設定
  // 注意: Supabaseの接続文字列にpgbouncer=trueが含まれている場合は自動的に適用される
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(prismaConfig);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

