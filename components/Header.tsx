"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { getSession, logout, type User } from "@/lib/api/auth";
// Headerコンポーネントでは、カウントは各ページで管理されるため、モックデータは不要

function HeaderContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // メニューが開いている時にbodyのスクロールをロック
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // クリーンアップ
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // パスが変更されたらメニューを閉じる
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // セッション情報を取得
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { user } = await getSession();
        setUser(user);
      } catch (error) {
        console.error('セッション取得エラー:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [pathname]); // パスが変更されたら再取得

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // ナビゲーション項目
  const navigationItems = [
    { href: "/browse/company", label: "企業一覧" },
    { href: "/organization", label: "ダッシュボード" },
  ];

  // 団体ページのタブ項目（カウントは各ページで管理）
  const organizationTabs = [
    { href: "/organization?tab=messages", label: "メッセージボックス" },
    { href: "/organization?tab=applied", label: "応募済み" },
    { href: "/organization?tab=kept", label: "キープ一覧" },
    { href: "/organization?tab=history", label: "閲覧履歴" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#003366] shadow-sm">
        <div className="lg:max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* ブランド */}
            <div className="flex items-center">
              <Link
                href="/browse/company"
                className="text-2xl font-bold text-white"
                onClick={closeMobileMenu}
              >
                Accel
              </Link>
            </div>

            {/* デスクトップナビゲーション */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/browse/company"
                className={`text-white font-medium hover:underline text-sm sm:text-base ${
                  pathname === "/browse/company" ? "underline" : ""
                }`}
              >
                企業一覧
              </Link>
              {loading ? (
                <div className="text-white text-sm">読み込み中...</div>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/organization"
                    className="flex items-center space-x-3 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#003366] font-semibold transition-transform group-hover:scale-105">
                      {user.userType === 'organization' ? '学' : '企'}
                    </div>
                    <span className="text-white font-medium group-hover:underline">
                      {user.name}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white text-sm hover:underline"
                  >
                    ログアウト
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-white font-medium hover:underline"
                >
                  ログイン
                </Link>
              )}
            </div>

            {/* モバイルハンバーガーボタン */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-white p-2 focus:outline-none"
              aria-label="メニューを開く"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* モバイルメニューオーバーレイ */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* モバイルメニュー */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[72px] left-0 right-0 bg-white shadow-lg z-50 max-h-[calc(100vh-72px)] overflow-y-auto">
          <nav className="px-4 py-4 space-y-2">
            {/* メインナビゲーション */}
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || (item.href === "/organization" && pathname === "/organization" && !searchParams.get("tab"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "bg-[#003366] text-white"
                      : "text-[#003366] hover:bg-[#E6ECF3]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {/* 団体ページのタブ */}
            {pathname === "/organization" && (
              <>
                <div className="border-t border-[#E6ECF3] my-2"></div>
                <div className="px-2 py-2">
                  <p className="text-xs font-semibold text-[#6B7A93] uppercase tracking-wide mb-2">団体ページ</p>
                  {organizationTabs.map((tab) => {
                    const activeTab = searchParams.get("tab");
                    const tabParam = tab.href.split("tab=")[1];
                    const isActive = activeTab === tabParam;
                    
                    return (
                      <Link
                        key={tab.href}
                        href={tab.href}
                        onClick={closeMobileMenu}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors mb-1 ${
                          isActive
                            ? "bg-[#003366] text-white"
                            : "text-[#003366] hover:bg-[#E6ECF3]"
                        }`}
                      >
                        <span>{tab.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
            
            {/* ユーザーアカウント情報 */}
            {user && (
              <div className="border-t border-[#E6ECF3] mt-4 pt-4">
                <Link
                  href="/organization"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-[#E6ECF3] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-[#003366] flex items-center justify-center text-white font-semibold">
                    {user.userType === 'organization' ? '学' : '企'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#003366]">{user.name}</p>
                    <p className="text-sm text-[#666666]">
                      {user.userType === 'organization' ? '団体アカウント' : '企業アカウント'}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="w-full mt-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  ログアウト
                </button>
              </div>
            )}
            {!user && !loading && (
              <div className="border-t border-[#E6ECF3] mt-4 pt-4">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 text-center bg-[#003366] text-white rounded-lg hover:bg-[#00294f] transition-colors"
                >
                  ログイン
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
}

export default function Header() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-50 bg-[#003366] shadow-sm">
        <div className="lg:max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <div className="flex items-center">
              <Link href="/browse/company" className="text-2xl font-bold text-white">
                Accel
              </Link>
            </div>
          </div>
        </div>
      </header>
    }>
      <HeaderContent />
    </Suspense>
  );
}

