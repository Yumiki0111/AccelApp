import { PrismaClient } from '@prisma/client';
import { hashPassword } from './utils/hash-password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 組織データの投入を開始します...');

  // まず、ユーザーを作成（組織代表者用）
  // テスト用パスワード: "password123"
  const testPassword = await hashPassword('password123');
  
  const representativeUser = await prisma.user.upsert({
    where: { email: 'team@next-innovators.jp' },
    update: {
      passwordHash: testPassword, // パスワードを更新
      status: 'active', // ステータスをactiveに設定
    },
    create: {
      email: 'team@next-innovators.jp',
      name: '山本 大輝',
      passwordHash: testPassword,
      emailVerified: true,
      userType: 'organization',
      status: 'active', // デフォルトでactiveに設定
      profile: {
        create: {
          phone: '03-1234-5678',
          universityEmail: 'team@next-innovators.jp',
          universityName: '首都圏5大学連合',
        },
      },
    },
  });

  console.log(`✅ 代表者ユーザーを作成しました: ${representativeUser.id}`);

  // 組織を作成（固定UUIDを使用してフロントエンドと一致させる）
  // UUID v4形式: org-001 を UUID に変換（固定値を使用）
  const organizationId = '00000000-0000-0000-0000-000000000001'; // org-001 の代替UUID
  
  const organization = await prisma.organization.upsert({
    where: { id: organizationId },
    update: {
      name: 'NEXT Innovators',
      tagline: '学生と企業の共創をつなぐソーシャルイノベーション団体',
      description: '関東圏の大学生を中心にテクノロジー・ビジネス・社会課題をテーマとしたプロジェクトを年間15件運営。企業との共創プログラムを通じ、学生の挑戦機会を創出しています。',
      joinCode: 'NEXT-5824',
      campus: '首都圏5大学連合',
      contactEmail: 'team@next-innovators.jp',
      contactPhone: '03-1234-5678',
      logoUrl: '/logos/organization-next-innovators.svg',
      representativeUserId: representativeUser.id,
    },
    create: {
      id: organizationId,
      name: 'NEXT Innovators',
      tagline: '学生と企業の共創をつなぐソーシャルイノベーション団体',
      description: '関東圏の大学生を中心にテクノロジー・ビジネス・社会課題をテーマとしたプロジェクトを年間15件運営。企業との共創プログラムを通じ、学生の挑戦機会を創出しています。',
      joinCode: 'NEXT-5824',
      campus: '首都圏5大学連合',
      contactEmail: 'team@next-innovators.jp',
      contactPhone: '03-1234-5678',
      logoUrl: '/logos/organization-next-innovators.svg',
      representativeUserId: representativeUser.id,
    },
  });

  console.log(`✅ 組織を作成しました: ${organization.id} - ${organization.name}`);

  // 組織メンバーを作成（代表者を追加）
  const member = await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: representativeUser.id,
      },
    },
    update: {
      role: '代表',
      status: 'active',
    },
    create: {
      organizationId: organization.id,
      userId: representativeUser.id,
      role: '代表',
      status: 'active',
      joinedAt: new Date('2021-04-01'),
    },
  });

  console.log(`✅ 組織メンバーを作成しました: ${member.id}`);

  // 追加のメンバーを数名作成（テスト用）
  const additionalMembers = [
    {
      email: 'member1@next-innovators.jp',
      role: '副代表' as const,
      universityName: '東京大学',
      faculty: '工学部',
      department: '情報工学科',
      grade: 3,
    },
    {
      email: 'member2@next-innovators.jp',
      role: '広報' as const,
      universityName: '早稲田大学',
      faculty: '商学部',
      department: '経営学科',
      grade: 2,
    },
    {
      email: 'member3@next-innovators.jp',
      role: '財務' as const,
      universityName: '慶應義塾大学',
      faculty: '経済学部',
      department: '経済学科',
      grade: 4,
    },
  ];

  for (const memberData of additionalMembers) {
    const user = await prisma.user.upsert({
      where: { email: memberData.email },
      update: {
        passwordHash: testPassword, // パスワードを更新
        status: 'active', // ステータスをactiveに設定
        profile: {
          upsert: {
            create: {
              universityEmail: memberData.email,
              universityName: memberData.universityName,
              faculty: memberData.faculty,
              department: memberData.department,
              grade: memberData.grade,
            },
            update: {
              universityEmail: memberData.email,
              universityName: memberData.universityName,
              faculty: memberData.faculty,
              department: memberData.department,
              grade: memberData.grade,
            },
          },
        },
      },
      create: {
        email: memberData.email,
        name: `メンバー ${memberData.email.split('@')[0]}`,
        passwordHash: testPassword,
        emailVerified: true,
        userType: 'organization',
        status: 'active', // デフォルトでactiveに設定
        profile: {
          create: {
            universityEmail: memberData.email,
            universityName: memberData.universityName,
            faculty: memberData.faculty,
            department: memberData.department,
            grade: memberData.grade,
          },
        },
      },
    });

    await prisma.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId: user.id,
        },
      },
      update: {},
      create: {
        organizationId: organization.id,
        userId: user.id,
        role: memberData.role,
        status: 'active',
        joinedAt: new Date('2023-04-01'),
      },
    });

    console.log(`✅ メンバーを作成しました: ${user.email}`);
  }

  console.log('🎉 組織データの投入が完了しました！');
}

main()
  .catch((e) => {
    console.error('❌ 組織データの投入中にエラーが発生しました:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

