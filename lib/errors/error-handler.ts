/**
 * エラーハンドリングユーティリティ
 */

export enum ErrorCode {
  // 認証エラー
  AUTHENTICATION_REQUIRED = 'AUTHENTICATION_REQUIRED',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  
  // 認可エラー
  AUTHORIZATION_FAILED = 'AUTHORIZATION_FAILED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // バリデーションエラー
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // リソースエラー
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  
  // サーバーエラー
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export class ApplicationError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApplicationError';
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): AppError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined,
    };
  }
}

/**
 * エラーをログに記録
 */
export function logError(error: Error | ApplicationError, context?: Record<string, any>) {
  const errorInfo: AppError = error instanceof ApplicationError
    ? error.toJSON()
    : {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
        stack: error.stack,
      };

  console.error('エラー発生:', {
    ...errorInfo,
    context,
    timestamp: new Date().toISOString(),
  });
}

/**
 * ユーザーフレンドリーなエラーメッセージを取得
 */
export function getUserFriendlyMessage(error: Error | ApplicationError): string {
  if (error instanceof ApplicationError) {
    switch (error.code) {
      case ErrorCode.AUTHENTICATION_REQUIRED:
        return 'ログインが必要です';
      case ErrorCode.AUTHENTICATION_FAILED:
        return 'メールアドレスまたはパスワードが正しくありません';
      case ErrorCode.SESSION_EXPIRED:
        return 'セッションの有効期限が切れました。再度ログインしてください';
      case ErrorCode.AUTHORIZATION_FAILED:
        return 'この操作を実行する権限がありません';
      case ErrorCode.INSUFFICIENT_PERMISSIONS:
        return 'このリソースにアクセスする権限がありません';
      case ErrorCode.VALIDATION_ERROR:
        return '入力内容に誤りがあります';
      case ErrorCode.INVALID_INPUT:
        return '無効な入力です';
      case ErrorCode.RESOURCE_NOT_FOUND:
        return 'リソースが見つかりません';
      case ErrorCode.RESOURCE_ALREADY_EXISTS:
        return 'このリソースは既に存在します';
      case ErrorCode.DATABASE_ERROR:
        return 'データベースエラーが発生しました';
      case ErrorCode.EXTERNAL_SERVICE_ERROR:
        return '外部サービスとの通信に失敗しました';
      default:
        return 'エラーが発生しました';
    }
  }

  return '予期しないエラーが発生しました';
}

