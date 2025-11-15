/**
 * 認証リポジトリインターフェース
 * クリーンアーキテクチャのドメインレイヤに定義
 */

export interface Session {
  id: string;
  userId: string;
  sessionToken: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithSession {
  id: string;
  email: string;
  name: string;
  userType: 'company' | 'organization';
  emailVerified: boolean;
  status: 'active' | 'pending' | 'invited' | 'suspended';
  organizationId?: string | null;
  companyId?: string | null;
}

/**
 * 認証リポジトリインターフェース
 */
export interface AuthRepository {
  /**
   * メールアドレスとパスワードでユーザーを認証
   */
  authenticate(email: string, password: string): Promise<UserWithSession | null>;

  /**
   * セッションを作成
   */
  createSession(userId: string, expiresAt: Date): Promise<Session>;

  /**
   * セッショントークンでセッションを取得
   */
  getSessionByToken(sessionToken: string): Promise<Session | null>;

  /**
   * セッションを削除
   */
  deleteSession(sessionToken: string): Promise<void>;

  /**
   * ユーザーのセッションをすべて削除
   */
  deleteAllUserSessions(userId: string): Promise<void>;

  /**
   * 有効期限切れのセッションを削除
   */
  deleteExpiredSessions(): Promise<number>;
}

