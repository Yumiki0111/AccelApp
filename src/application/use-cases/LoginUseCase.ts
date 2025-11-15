import { AuthRepository, UserWithSession } from '../../domain/repositories/AuthRepository';
import { ApplicationError, ErrorCode } from '../../../lib/errors/error-handler';

export interface LoginResult {
  user: UserWithSession;
  sessionToken: string;
}

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(email: string, password: string): Promise<LoginResult> {
    if (!email || !password) {
      throw new ApplicationError(
        ErrorCode.VALIDATION_ERROR,
        'メールアドレスとパスワードを入力してください'
      );
    }

    // ユーザー認証
    const user = await this.authRepository.authenticate(email, password);

    if (!user) {
      throw new ApplicationError(
        ErrorCode.AUTHENTICATION_FAILED,
        'メールアドレスまたはパスワードが正しくありません'
      );
    }

    // セッション作成（30日間有効）
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const session = await this.authRepository.createSession(user.id, expiresAt);

    return {
      user,
      sessionToken: session.sessionToken,
    };
  }
}

