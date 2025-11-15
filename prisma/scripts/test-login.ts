/**
 * ログインをテストするスクリプト
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'team@next-innovators.jp';
  const password = 'password123';

  console.log('🔐 ログインテストを実行します...\n');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('');

  // ユーザーを取得
  const user = await prisma.user.findUnique({
    where: { email, deletedAt: null },
    include: {
      organizationMembers: {
        where: { status: 'active' },
        take: 1,
        include: {
          organization: true,
        },
      },
      companyContacts: {
        where: { isPrimary: true },
        take: 1,
        include: {
          company: true,
        },
      },
    },
  });

  console.log('1. ユーザー検索:');
  if (!user) {
    console.log('   ❌ ユーザーが見つかりません');
    return;
  }
  console.log('   ✅ ユーザーが見つかりました');
  console.log('   - ID:', user.id);
  console.log('   - Status:', user.status);
  console.log('');

  // パスワード検証
  console.log('2. パスワード検証:');
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    console.log('   ❌ パスワードが一致しません');
    console.log('   - Hash:', user.passwordHash);
    return;
  }
  console.log('   ✅ パスワードが一致しました');
  console.log('');

  // ステータスチェック
  console.log('3. ステータスチェック:');
  if (user.status !== 'active') {
    console.log('   ❌ ユーザーステータスが"active"ではありません:', user.status);
    return;
  }
  console.log('   ✅ ユーザーステータスは"active"です');
  console.log('');

  // 組織ID取得
  console.log('4. 組織ID取得:');
  const organizationId = user.organizationMembers[0]?.organizationId || null;
  console.log('   - Organization ID:', organizationId);
  console.log('');

  console.log('✅ すべてのチェックが成功しました！');
  console.log('   ログイン可能です。');
}

main()
  .catch((e) => {
    console.error('❌ エラー:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

