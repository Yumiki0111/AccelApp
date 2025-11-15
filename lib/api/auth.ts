/**
 * 認証関連のAPIクライアント
 */

export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'company' | 'organization';
  organizationId?: string | null;
  companyId?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
}

export interface SessionResponse {
  user: User | null;
}

/**
 * ログイン
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    let errorMessage = 'ログインに失敗しました';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (parseError) {
      // JSON解析に失敗した場合、レスポンステキストを使用
      try {
        const text = await response.text();
        errorMessage = text || errorMessage;
      } catch (textError) {
        // テキスト取得にも失敗した場合、デフォルトメッセージを使用
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * ログアウト
 */
export async function logout(): Promise<void> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('ログアウトに失敗しました');
  }
}

/**
 * セッション情報を取得
 */
export async function getSession(): Promise<SessionResponse> {
  const response = await fetch('/api/auth/session', {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    return { user: null };
  }

  return response.json();
}

