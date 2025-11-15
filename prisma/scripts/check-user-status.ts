/**
 * ユーザーステータスを確認するスクリプト
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'team@next-innovators.jp';

  console.log('🔍 ユーザーステータスを確認します...\n');

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      organizationMembers: {
        where: { status: 'active' },
        take: 1,
      },
    },
  });

  if (!user) {
    console.error('❌ ユーザーが見つかりません:', email);
    return;
  }

  console.log('✅ ユーザー情報:');
  console.log('  - ID:', user.id);
  console.log('  - Email:', user.email);
  console.log('  - Name:', user.name);
  console.log('  - User Type:', user.userType);
  console.log('  - Status:', user.status);
  console.log('  - Email Verified:', user.emailVerified);
  console.log('  - Deleted At:', user.deletedAt);
  console.log('  - Organization Members:', user.organizationMembers.length);
  console.log('');

  if (user.status !== 'active') {
    console.log('⚠️  ユーザーステータスが"active"ではありません。');
    console.log('   ステータスを更新します...');
    
    await prisma.user.update({
      where: { id: user.id },
      data: { status: 'active' },
    });
    
    console.log('✅ ステータスを"active"に更新しました。');
  } else {
    console.log('✅ ユーザーステータスは"active"です。');
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

