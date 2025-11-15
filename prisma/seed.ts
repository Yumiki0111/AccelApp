import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 シードデータの投入を開始します...');

  // ============================================
  // タグマスタの投入
  // ============================================
  console.log('📌 タグマスタを投入中...');

  const industryTags = [
    'IT', '人材', '教育', '広告', 'デザイン', 'メディア', '食品', 'メーカー',
    'SaaS', '環境', '社会貢献', '金融', 'コンサルティング', 'エンターテインメント',
    '医療', 'ヘルスケア', '不動産', '物流', '運輸', 'EC', '小売', 'エネルギー',
    '製造業', '機械', 'ものづくり', '建設', 'インフラ', '旅行', '観光', 'サービス', '出版'
  ];

  const featureTags = [
    'スタートアップ支援', '学生向け', '大学連携', 'イベント協賛', 'メンタリング',
    '技術支援', '資金提供', '物品提供', '共催イベント'
  ];

  const universityTags = [
    '東京大学', '早稲田大学', '慶應義塾大学', '明治大学', '京都大学',
    '大阪大学', '一橋大学', '東京工業大学'
  ];

  // 業界タグの投入
  for (let i = 0; i < industryTags.length; i++) {
    await prisma.tag.upsert({
      where: {
        type_label: {
          type: 'industry',
          label: industryTags[i],
        },
      },
      update: {
        displayOrder: i,
      },
      create: {
        type: 'industry',
        label: industryTags[i],
        displayOrder: i,
      },
    });
  }

  // 特徴タグの投入
  for (let i = 0; i < featureTags.length; i++) {
    await prisma.tag.upsert({
      where: {
        type_label: {
          type: 'feature',
          label: featureTags[i],
        },
      },
      update: {
        displayOrder: i,
      },
      create: {
        type: 'feature',
        label: featureTags[i],
        displayOrder: i,
      },
    });
  }

  // 大学タグの投入
  for (let i = 0; i < universityTags.length; i++) {
    await prisma.tag.upsert({
      where: {
        type_label: {
          type: 'university',
          label: universityTags[i],
        },
      },
      update: {
        displayOrder: i,
      },
      create: {
        type: 'university',
        label: universityTags[i],
        displayOrder: i,
      },
    });
  }

  console.log(`✅ ${industryTags.length + featureTags.length + universityTags.length}個のタグを投入しました`);

  // ============================================
  // 地域マスタの投入
  // ============================================
  console.log('🌍 地域マスタを投入中...');

  const regions = [
    { code: 'all', name: '全国', order: 0 },
    { code: 'tokyo', name: '東京', order: 1 },
    { code: 'kansai', name: '関西', order: 2 },
    { code: 'kanto', name: '関東全域', order: 3 },
    { code: 'online', name: 'オンライン', order: 4 },
  ];

  for (const region of regions) {
    await prisma.region.upsert({
      where: {
        code: region.code,
      },
      update: {
        name: region.name,
        displayOrder: region.order,
      },
      create: {
        code: region.code,
        name: region.name,
        displayOrder: region.order,
      },
    });
  }

  console.log(`✅ ${regions.length}個の地域を投入しました`);

  console.log('🎉 シードデータの投入が完了しました！');
}

main()
  .catch((e) => {
    console.error('❌ シードデータの投入中にエラーが発生しました:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

