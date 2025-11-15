import { AuthRepository, Session, UserWithSession } from '../../domain/repositories/AuthRepository';
import { prisma } from '../database/prisma';
import bcrypt from 'bcryptjs';

export class PrismaAuthRepository implements AuthRepository {
  async authenticate(email: string, password: string): Promise<UserWithSession | null> {
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

    if (!user) return null;

    // パスワード検証
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return null;

    // ユーザーステータスチェック
    if (user.status !== 'active') return null;

    // 組織IDまたは企業IDを取得
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

  async createSession(userId: string, expiresAt: Date): Promise<Session> {
    // セッショントークンを生成（ランダムな文字列）
    const sessionToken = this.generateSessionToken();

    const session = await prisma.session.create({
      data: {
        userId,
        sessionToken,
        expiresAt,
      },
    });

    return {
      id: session.id,
      userId: session.userId,
      sessionToken: session.sessionToken,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }

  async getSessionByToken(sessionToken: string): Promise<Session | null> {
    const session = await prisma.session.findUnique({
      where: { sessionToken },
    });

    if (!session) return null;

    // 有効期限チェック
    if (session.expiresAt < new Date()) {
      // 有効期限切れのセッションは削除
      await prisma.session.delete({ where: { id: session.id } });
      return null;
    }

    return {
      id: session.id,
      userId: session.userId,
      sessionToken: session.sessionToken,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }

  async deleteSession(sessionToken: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { sessionToken },
    });
  }

  async deleteAllUserSessions(userId: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { userId },
    });
  }

  async deleteExpiredSessions(): Promise<number> {
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }

  /**
   * セッショントークンを生成（ランダムな文字列）
   */
  private generateSessionToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 64; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }
}

