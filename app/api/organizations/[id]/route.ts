import { NextRequest, NextResponse } from 'next/server';
import { PrismaOrganizationRepository } from '../../../../src/infrastructure/repositories/PrismaOrganizationRepository';
import { GetOrganizationDashboardUseCase } from '../../../../src/application/use-cases/GetOrganizationDashboardUseCase';

const organizationRepository = new PrismaOrganizationRepository();
const getOrganizationDashboardUseCase = new GetOrganizationDashboardUseCase(organizationRepository);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: '組織IDが指定されていません' },
        { status: 400 }
      );
    }

    const organization = await organizationRepository.findById(id);

    if (!organization) {
      return NextResponse.json(
        { error: '組織が見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(organization, { status: 200 });
  } catch (error) {
    console.error('組織情報取得エラー:', error);
    return NextResponse.json(
      { error: '組織情報の取得に失敗しました', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

