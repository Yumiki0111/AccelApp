import {
  OrganizationRepository,
  OrganizationProfile,
  OrganizationMember,
  OrganizationDashboard,
} from '../../domain/repositories/OrganizationRepository';
import { prisma } from '../database/prisma';

export class PrismaOrganizationRepository implements OrganizationRepository {
  async findById(id: string): Promise<OrganizationProfile | null> {
    const organization = await prisma.organization.findUnique({
      where: { id, deletedAt: null },
    });

    if (!organization) return null;

    return {
      id: organization.id,
      name: organization.name,
      tagline: organization.tagline,
      description: organization.description,
      joinCode: organization.joinCode,
      campus: organization.campus,
      contactEmail: organization.contactEmail,
      contactPhone: organization.contactPhone,
      logoUrl: organization.logoUrl,
      representativeUserId: organization.representativeUserId,
      createdAt: organization.createdAt,
    };
  }

  async findByJoinCode(joinCode: string): Promise<OrganizationProfile | null> {
    const organization = await prisma.organization.findUnique({
      where: { joinCode, deletedAt: null },
    });

    if (!organization) return null;

    return {
      id: organization.id,
      name: organization.name,
      tagline: organization.tagline,
      description: organization.description,
      joinCode: organization.joinCode,
      campus: organization.campus,
      contactEmail: organization.contactEmail,
      contactPhone: organization.contactPhone,
      logoUrl: organization.logoUrl,
      representativeUserId: organization.representativeUserId,
      createdAt: organization.createdAt,
    };
  }

  async getDashboard(organizationId: string): Promise<OrganizationDashboard | null> {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId, deletedAt: null },
      include: {
        members: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });

    if (!organization) return null;

    const profile: OrganizationProfile = {
      id: organization.id,
      name: organization.name,
      tagline: organization.tagline,
      description: organization.description,
      joinCode: organization.joinCode,
      campus: organization.campus,
      contactEmail: organization.contactEmail,
      contactPhone: organization.contactPhone,
      logoUrl: organization.logoUrl,
      representativeUserId: organization.representativeUserId,
      createdAt: organization.createdAt,
    };

    const allMembers: OrganizationMember[] = organization.members.map((member) => {
      const profile = member.user.profile as { faculty?: string | null; department?: string | null; grade?: number | null; universityName?: string | null } | null;
      return {
        id: member.id,
        userId: member.userId,
        role: member.role,
        status: member.status,
        joinedAt: member.joinedAt,
        university: profile?.universityName || null,
        faculty: profile?.faculty || null,
        department: profile?.department || null,
        grade: profile?.grade || null,
      };
    });

    const members = allMembers.filter((m) => m.status === 'active');
    const pendingRequests = allMembers.filter((m) => m.status === 'pending' || m.status === 'invited');

    return {
      profile,
      members,
      pendingRequests,
    };
  }

  async getMembers(organizationId: string): Promise<OrganizationMember[]> {
    const members = await prisma.organizationMember.findMany({
      where: { organizationId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    return members.map((member) => {
      const profile = member.user.profile as { faculty?: string | null; department?: string | null; grade?: number | null; universityName?: string | null } | null;
      return {
        id: member.id,
        userId: member.userId,
        role: member.role,
        status: member.status,
        joinedAt: member.joinedAt,
        university: profile?.universityName || null,
        faculty: profile?.faculty || null,
        department: profile?.department || null,
        grade: profile?.grade || null,
      };
    });
  }
}

