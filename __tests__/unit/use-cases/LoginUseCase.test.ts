/**
 * LoginUseCaseのユニットテスト
 */

import { LoginUseCase } from '@/src/application/use-cases/LoginUseCase';
import { AuthRepository } from '@/src/domain/repositories/AuthRepository';

// モックリポジトリ
class MockAuthRepository implements AuthRepository {
  async authenticate() {
    return {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      userType: 'organization' as const,
      emailVerified: true,
      status: 'active' as const,
      organizationId: 'org-1',
      companyId: null,
    };
  }

  async createSession() {
    return {
      id: 'session-1',
      userId: 'user-1',
      sessionToken: 'test-token',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async getSessionByToken() {
    return null;
  }

  async deleteSession() {}
  async deleteAllUserSessions() {}
  async deleteExpiredSessions() {
    return 0;
  }
}

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let authRepository: MockAuthRepository;

  beforeEach(() => {
    authRepository = new MockAuthRepository();
    useCase = new LoginUseCase(authRepository);
  });

  describe('execute', () => {
    it('正しい認証情報でログインできる', async () => {
      const result = await useCase.execute('test@example.com', 'password123');

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      expect(result.sessionToken).toBeDefined();
    });

    it('間違った認証情報でログインできない', async () => {
      // authenticateがnullを返す場合をシミュレート
      const originalAuthenticate = authRepository.authenticate.bind(authRepository);
      authRepository.authenticate = jest.fn().mockResolvedValueOnce(null);

      await expect(
        useCase.execute('wrong@example.com', 'wrongpassword')
      ).rejects.toThrow('メールアドレスまたはパスワードが正しくありません');

      // 元のメソッドを復元
      authRepository.authenticate = originalAuthenticate;
    });

    it('メールアドレスが空の場合はエラーを投げる', async () => {
      await expect(
        useCase.execute('', 'password123')
      ).rejects.toThrow('メールアドレスとパスワードを入力してください');
    });

    it('パスワードが空の場合はエラーを投げる', async () => {
      await expect(
        useCase.execute('test@example.com', '')
      ).rejects.toThrow('メールアドレスとパスワードを入力してください');
    });
  });
});

