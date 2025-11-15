/**
 * パスワードハッシュを確認するスクリプト
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'team@next-innovators.jp';
  const testPassword = 'password123';

  console.log('🔍 パスワードハッシュを確認します...\n');

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error('❌ ユーザーが見つかりません:', email);
    return;
  }

  console.log('✅ ユーザーが見つかりました:');
  console.log('  - ID:', user.id);
  console.log('  - Email:', user.email);
  console.log('  - Name:', user.name);
  console.log('  - Password Hash:', user.passwordHash);
  console.log('  - Hash Length:', user.passwordHash.length);
  console.log('');

  // パスワード検証
  console.log('🔐 パスワード検証を実行します...');
  const isValid = await bcrypt.compare(testPassword, user.passwordHash);
  console.log('  - 検証結果:', isValid ? '✅ 成功' : '❌ 失敗');
  console.log('');

  if (!isValid) {
    console.log('⚠️  パスワードハッシュが正しくありません。');
    console.log('   シードスクリプトを再実行してください:');
    console.log('   npm run db:seed:organizations');
  } else {
    console.log('✅ パスワードハッシュは正しく設定されています。');
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

