import { PrismaClient } from '@prisma/client';
import { mockCompanies } from '../lib/mockData';

const prisma = new PrismaClient();

async function main() {
  console.log('🏢 企業データの投入を開始します...');

  // タグを取得（業界タグのマッピング用）
  const tags = await prisma.tag.findMany({
    where: { type: 'industry' },
  });

  const tagMap = new Map(tags.map((tag: { label: string; id: string }) => [tag.label, tag.id]));

  let createdCount = 0;

  for (const mockCompany of mockCompanies.slice(0, 6)) {
    // 企業を作成
    const company = await prisma.company.create({
      data: {
        name: mockCompany.name,
        logoUrl: mockCompany.logoUrl,
        heroImageUrl: mockCompany.heroImageUrl,
        philosophy: mockCompany.philosophy,
        ratingScore: mockCompany.rating,
        ratingCount: mockCompany.reviewCount,
      },
    });

    // 担当者を作成
    const contact = await prisma.companyContact.create({
      data: {
        companyId: company.id,
        name: mockCompany.contact.name,
        role: mockCompany.contact.role,
        email: `contact@${mockCompany.name.toLowerCase().replace(/\s+/g, '')}.com`,
        isPrimary: true,
      },
    });

    // 主担当者を設定
    await prisma.company.update({
      where: { id: company.id },
      data: { primaryContactId: contact.id },
    });

    // 協賛条件を作成
    await prisma.sponsorshipCondition.create({
      data: {
        companyId: company.id,
        cashSupportAvailable: mockCompany.conditions.cashSupport.available,
        cashSupportDetail: mockCompany.conditions.cashSupport.detail || null,
        goodsSupportAvailable: mockCompany.conditions.goodsSupport.available,
        goodsSupportDetail: mockCompany.conditions.goodsSupport.detail || null,
        mentoringAvailable: mockCompany.conditions.mentoring.available,
        mentoringDetail: mockCompany.conditions.mentoring.detail || null,
        cohostEventAvailable: mockCompany.conditions.cohostEvent.available,
        cohostEventDetail: mockCompany.conditions.cohostEvent.detail || null,
      },
    });

    // 協賛プランを作成
    const plan = await prisma.sponsorshipPlan.create({
      data: {
        companyId: company.id,
        title: mockCompany.plan.title,
        summary: mockCompany.plan.summary,
        imageUrl: mockCompany.plan.imageUrl,
        coverageArea: mockCompany.coverageArea,
        isActive: true,
      },
    });

    // 協賛タイプを設定
    for (const sponsorshipType of mockCompany.sponsorshipTypes) {
      await prisma.sponsorshipPlanType.create({
        data: {
          planId: plan.id,
          sponsorshipType: sponsorshipType as any,
        },
      });
    }

    // 業界タグを設定
    for (const industryTag of mockCompany.industryTags) {
      const tagId = tagMap.get(industryTag);
      if (tagId) {
        await prisma.companyTag.create({
          data: {
            companyId: company.id,
            tagId: tagId,
          },
        });
      }
    }

    // 実績を作成
    for (let i = 0; i < mockCompany.achievements.length; i++) {
      const achievement = mockCompany.achievements[i];
      await prisma.achievement.create({
        data: {
          companyId: company.id,
          organizationName: achievement.organizationName,
          eventName: achievement.eventName,
          description: achievement.description,
          logoUrl: achievement.logoUrl,
          displayOrder: i,
        },
      });
    }

    createdCount++;
    console.log(`✅ ${mockCompany.name} を作成しました`);
  }

  console.log(`🎉 ${createdCount}件の企業データを投入しました！`);
}

main()
  .catch((e) => {
    console.error('❌ 企業データの投入中にエラーが発生しました:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

