import { AuthRepository, UserWithSession } from '../../domain/repositories/AuthRepository';
import { prisma } from '../../infrastructure/database/prisma';

export class GetSessionUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(sessionToken: string): Promise<UserWithSession | null> {
    if (!sessionToken) {
      return null;
    }

    const session = await this.authRepository.getSessionByToken(sessionToken);

    if (!session) {
      return null;
    }

    // ユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: session.userId, deletedAt: null },
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

    if (!user || user.status !== 'active') {
      return null;
    }

    const organizationId = user.organizationMembers[0]?.organizationId || null;
    const companyId = user.companyContacts[0]?.companyId || null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.userType,
      emailVerified: user.emailVerified,
      status: user.status,
      organizationId,
      companyId,
    };
  }
}

