import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 認証が必要なパス
 */
const protectedPaths = [
  '/organization',
  '/api/organizations',
  '/api/chat',
  '/api/companies/*/proposals',
];

/**
 * 認証が不要なパス
 */
const publicPaths = [
  '/api/auth',
  '/api/companies',
  '/api/filters',
  '/browse',
  '/login',
];

/**
 * パスが保護されているかチェック
 */
function isProtectedPath(pathname: string): boolean {
  // 公開パスをチェック
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return false;
  }

  // 保護パスをチェック
  return protectedPaths.some((path) => {
    if (path.endsWith('/*')) {
      const basePath = path.slice(0, -2);
      return pathname.startsWith(basePath);
    }
    return pathname.startsWith(path);
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 保護されたパスの場合、認証チェック
  if (isProtectedPath(pathname)) {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      // ログインページにリダイレクト
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // セッション検証はAPIルートで行う（ここではCookieの存在のみチェック）
    // 実際のセッション検証は各APIルートで実装
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

