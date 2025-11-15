import {
  ProposalRepository,
  Proposal,
  CreateProposalParams,
} from '../../domain/repositories/ProposalRepository';
import { prisma } from '../database/prisma';

export class PrismaProposalRepository implements ProposalRepository {
  async create(params: CreateProposalParams): Promise<Proposal> {
    const proposal = await prisma.proposal.create({
      data: {
        organizationId: params.organizationId,
        companyId: params.companyId,
        planId: params.planId || null,
        message: params.message,
        status: '申請済み',
        submittedByUserId: params.submittedByUserId,
        submittedAt: new Date(),
      },
    });

    return {
      id: proposal.id,
      organizationId: proposal.organizationId,
      companyId: proposal.companyId,
      planId: proposal.planId,
      message: proposal.message,
      status: proposal.status,
      submittedByUserId: proposal.submittedByUserId,
      submittedAt: proposal.submittedAt,
      reviewedAt: proposal.reviewedAt,
      reviewedByUserId: proposal.reviewedByUserId,
    };
  }

  async findByOrganizationId(organizationId: string): Promise<Proposal[]> {
    const proposals = await prisma.proposal.findMany({
      where: { organizationId },
      orderBy: { submittedAt: 'desc' },
    });

    return proposals.map((proposal: any) => ({
      id: proposal.id,
      organizationId: proposal.organizationId,
      companyId: proposal.companyId,
      planId: proposal.planId,
      message: proposal.message,
      status: proposal.status,
      submittedByUserId: proposal.submittedByUserId,
      submittedAt: proposal.submittedAt,
      reviewedAt: proposal.reviewedAt,
      reviewedByUserId: proposal.reviewedByUserId,
    }));
  }

  async findByCompanyId(companyId: string): Promise<Proposal[]> {
    const proposals = await prisma.proposal.findMany({
      where: { companyId },
      orderBy: { submittedAt: 'desc' },
    });

    return proposals.map((proposal: any) => ({
      id: proposal.id,
      organizationId: proposal.organizationId,
      companyId: proposal.companyId,
      planId: proposal.planId,
      message: proposal.message,
      status: proposal.status,
      submittedByUserId: proposal.submittedByUserId,
      submittedAt: proposal.submittedAt,
      reviewedAt: proposal.reviewedAt,
      reviewedByUserId: proposal.reviewedByUserId,
    }));
  }

  async findById(id: string): Promise<Proposal | null> {
    const proposal = await prisma.proposal.findUnique({
      where: { id },
    });

    if (!proposal) return null;

    return {
      id: proposal.id,
      organizationId: proposal.organizationId,
      companyId: proposal.companyId,
      planId: proposal.planId,
      message: proposal.message,
      status: proposal.status,
      submittedByUserId: proposal.submittedByUserId,
      submittedAt: proposal.submittedAt,
      reviewedAt: proposal.reviewedAt,
      reviewedByUserId: proposal.reviewedByUserId,
    };
  }
}

