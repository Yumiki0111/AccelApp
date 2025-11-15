import { AuthRepository } from '../../domain/repositories/AuthRepository';

export class LogoutUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(sessionToken: string): Promise<void> {
    if (!sessionToken) {
      throw new Error('セッショントークンが指定されていません');
    }

    await this.authRepository.deleteSession(sessionToken);
  }
}

