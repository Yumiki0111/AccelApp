/**
 * セッション作成をテストするスクリプト
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 セッション作成をテストします...\n');

  // Prismaクライアントの確認
  console.log('1. Prismaクライアントの確認:');
  console.log('   - prisma:', typeof prisma);
  console.log('   - prisma.session:', typeof prisma.session);
  console.log('   - prisma.session.create:', typeof prisma.session?.create);
  console.log('');

  if (!prisma.session) {
    console.error('❌ prisma.sessionがundefinedです');
    console.log('   Prismaクライアントを再生成してください:');
    console.log('   npx prisma generate');
    return;
  }

  if (!prisma.session.create) {
    console.error('❌ prisma.session.createがundefinedです');
    return;
  }

  // テストユーザーを取得
  const user = await prisma.user.findFirst({
    where: { email: 'team@next-innovators.jp' },
  });

  if (!user) {
    console.error('❌ テストユーザーが見つかりません');
    return;
  }

  console.log('2. テストユーザー:');
  console.log('   - ID:', user.id);
  console.log('   - Email:', user.email);
  console.log('');

  // セッション作成をテスト
  console.log('3. セッション作成をテスト:');
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: 'test-token-' + Date.now(),
        expiresAt,
      },
    });

    console.log('   ✅ セッション作成成功');
    console.log('   - Session ID:', session.id);
    console.log('   - User ID:', session.userId);
    console.log('   - Token:', session.sessionToken);
    console.log('');

    // テストセッションを削除
    await prisma.session.delete({
      where: { id: session.id },
    });
    console.log('   ✅ テストセッションを削除しました');
  } catch (error) {
    console.error('   ❌ セッション作成エラー:', error);
    if (error instanceof Error) {
      console.error('   - Message:', error.message);
      console.error('   - Stack:', error.stack);
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ エラー:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

