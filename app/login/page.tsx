"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login, getSession } from "@/lib/api/auth";
import Header from "@/components/Header";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/organization";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // 既にログインしているかチェック
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { user } = await getSession();
        if (user) {
          // 既にログインしている場合はリダイレクト
          router.push(redirect);
        }
      } catch (error) {
        console.error("セッション確認エラー:", error);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      // ログイン成功後、リダイレクト先に移動
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#666666]">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white border border-[#E6ECF3] rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-[#333333] mb-2 text-center">
              ログイン
            </h1>
            <p className="text-sm text-[#666666] mb-8 text-center">
              メールアドレスとパスワードを入力してください
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[#333333] mb-2"
                >
                  メールアドレス
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-[#E6ECF3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#333333] mb-2"
                >
                  パスワード
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-[#E6ECF3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                  placeholder="パスワードを入力"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#003366] hover:bg-[#00294f] text-white font-bold rounded-2xl transition-colors disabled:bg-[#E6ECF3] disabled:text-[#666666] disabled:cursor-not-allowed"
              >
                {loading ? "ログイン中..." : "ログイン"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-[#666666]">
                テスト用アカウント:
              </p>
              <p className="text-xs text-[#666666] mt-1">
                メール: team@next-innovators.jp
              </p>
              <p className="text-xs text-[#666666]">
                パスワード: password123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#666666]">読み込み中...</div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}

