"use client";

import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { getCompanyDetail, type CompanyDetail } from "@/lib/api/companies";
import { getSession, type User } from "@/lib/api/auth";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;
  
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyId) {
        setError('企業IDが指定されていません');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getCompanyDetail(companyId);
        setCompany(data);
      } catch (err) {
        console.error('企業詳細の取得エラー:', err);
        setError(err instanceof Error ? err.message : '企業詳細の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="lg:max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-[#666666] text-lg">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="lg:max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-[#666666] text-lg">{error || '企業が見つかりませんでした'}</p>
            <button
              onClick={() => router.push("/browse/company")}
              className="mt-4 px-6 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#00294f] transition-colors"
            >
              企業一覧に戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="lg:max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* パンくずリスト */}
        <div className="mb-4 text-sm text-[#666666]">
          <span className="hover:text-[#003366] cursor-pointer" onClick={() => router.push("/browse/company")}>
            協賛企業一覧
          </span>
          <span className="mx-2">/</span>
          <span className="text-[#333333]">{company.name}</span>
        </div>

        {/* メインコンテンツ */}
        <main className="space-y-6">
          {/* 企業情報カード */}
          <div className="bg-white rounded-lg shadow-sm p-5 sm:p-6">
            {/* 画像と会社名、どんな会社か */}
            <div className="flex flex-col sm:flex-row gap-5 mb-6">
              {/* ヒーロー画像 */}
              <div className="w-full sm:w-64 flex-shrink-0">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#E6ECF3]">
                  {company.heroImageUrl ? (
                    <Image
                      src={company.heroImageUrl}
                      alt={`${company.name} チーム写真`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[#003366] font-semibold">画像なし</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 会社名、タグ、どんな会社か */}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#333333] mb-3">
                  {company.name}
                </h1>
                <div className="flex flex-wrap gap-2 mb-5">
                  {company.industryTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-[#E6ECF3] text-[#003366] text-sm font-medium rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* どんな会社か */}
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#333333] mb-3">
                    どんな会社か
                  </h2>
                  <div className="space-y-3 text-[#666666] leading-relaxed">
                    {company.philosophy ? (
                      <p className="text-base">
                        {company.philosophy}
                      </p>
                    ) : (
                      <p className="text-base text-[#999999]">
                        説明がありません
                      </p>
                    )}
                    <p className="text-sm">
                      {company.name}は、{company.industryTags.join('・')}分野において、学生団体との連携を積極的に推進している企業です。私たちは、学生の皆さんが取り組む活動やイベントを通じて、次世代のリーダーシップとイノベーションを育成することを大切にしています。
                    </p>
                    <p className="text-sm">
                      学生団体との協賛を通じて、若い世代の視点やエネルギーを取り入れながら、共に成長していくことを目指しています。企業としての経験やリソースを提供することで、学生の皆さんの挑戦を全面的にサポートしたいと考えています。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* どんなことに取り組んでいるか */}
            <div className="border-t border-[#E6ECF3] pt-6">
              <h2 className="text-lg sm:text-xl font-bold text-[#333333] mb-3">
                どんなことに取り組んでいるか
              </h2>
              <div className="space-y-3 text-[#666666] leading-relaxed">
                <p className="text-base font-medium text-[#333333]">
                  {company.plan.title}
                </p>
                <p className="text-base">
                  {company.plan.summary || '説明がありません'}
                </p>
                <p className="text-sm">
                  私たちは、学生団体が主催するイベントや活動に対して、さまざまな形でサポートを提供しています。具体的な取り組み内容については、学生団体の皆さんと直接お話ししながら、最適な協賛の形を一緒に考えさせていただきたいと考えています。
                </p>
                <p className="text-sm">
                  学生団体の活動目的や規模、必要なサポート内容など、詳細については個別にご相談いただけます。私たちは、学生の皆さんの想いやビジョンに共感し、実現に向けてできる限りの支援を行いたいと考えています。
                </p>
              </div>
            </div>

            {/* 協賛実績 */}
            {company.achievements && company.achievements.length > 0 && (
              <div className="border-t border-[#E6ECF3] pt-6 mt-6">
                <h2 className="text-lg sm:text-xl font-bold text-[#333333] mb-4">
                  協賛実績
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {company.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="bg-[#F9F9F9] rounded-lg p-4 border border-[#E6ECF3]"
                    >
                      <div className="flex items-start gap-3">
                        {achievement.logoUrl ? (
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <Image
                              src={achievement.logoUrl}
                              alt={achievement.organizationName}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 flex-shrink-0 bg-[#E6ECF3] rounded flex items-center justify-center">
                            <span className="text-[#003366] text-xs font-semibold">ロゴ</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#333333] text-sm mb-1">
                            {achievement.organizationName}
                          </p>
                          <p className="text-[#003366] font-medium text-sm mb-1">
                            {achievement.eventName}
                          </p>
                          {achievement.description && (
                            <p className="text-[#666666] text-xs leading-relaxed">
                              {achievement.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 応募フォーム */}
          <ProposalForm companyId={company.id} companyName={company.name} />
        </main>
      </div>
    </div>
  );
}

function ProposalForm({ companyId, companyName }: { companyId: string; companyName: string }) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const router = useRouter();

  // 認証情報を取得
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { user: sessionUser } = await getSession();
        setUser(sessionUser);
      } catch (err) {
        console.error('セッション取得エラー:', err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting || !user) return;

    if (user.userType !== 'organization' || !user.organizationId) {
      setError('この機能は組織ユーザーのみ利用可能です');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { submitProposal } = await import('@/lib/api/companies');
      await submitProposal(companyId, {
        organizationId: user.organizationId,
        message: message.trim(),
        submittedByUserId: user.id,
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('提携申込エラー:', err);
      setError(err instanceof Error ? err.message : '提携申込に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
        <div className="text-center py-8">
          <div className="text-5xl mb-4">✓</div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#333333] mb-3">
            提携申請を送信しました
          </h2>
          <p className="text-base text-[#666666] mb-6 max-w-md mx-auto">
            {companyName}からの返信をお待ちください。通常、3営業日以内にご返信いたします。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push(`/chat/${companyId}`)}
              className="px-8 py-3 bg-[#003366] hover:bg-[#00294f] text-white font-semibold rounded-lg transition-colors"
            >
              チャットでやり取りする
            </button>
            <button
              onClick={() => router.push("/browse/company")}
              className="px-8 py-3 bg-white hover:bg-[#F9F9F9] text-[#333333] font-semibold rounded-lg transition-colors border border-[#E6ECF3]"
            >
              企業一覧に戻る
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (loadingUser) {
    return (
      <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
        <div className="text-center py-8">
          <p className="text-[#666666]">認証情報を確認中...</p>
        </div>
      </section>
    );
  }

  if (!user || user.userType !== 'organization' || !user.organizationId) {
    return (
      <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
        <div className="text-center py-8">
          <p className="text-[#666666] mb-4">この機能は組織ユーザーのみ利用可能です</p>
          <button
            onClick={() => router.push('/login?redirect=' + encodeURIComponent('/browse/company/' + companyId))}
            className="px-6 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#00294f] transition-colors"
          >
            ログインする
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-[#333333] mb-6">
        提携を申し込む
      </h2>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 団体情報（自動入力） */}
        <div className="p-4 bg-[#E6ECF3] rounded-lg">
          <p className="text-sm text-[#666666] mb-2">申込団体</p>
          <p className="font-semibold text-[#333333] text-base">{user.name}</p>
          <p className="text-sm text-[#666666] mt-1">
            {user.email}
          </p>
        </div>

        {/* 提案メッセージ */}
        <div>
          <label className="block text-base font-semibold text-[#333333] mb-2">
            提案メッセージ <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-[#666666] mb-3">
            企業への提案内容や、協賛に関するご希望などを詳しくご記載ください。いただいた情報をもとに、最適な協賛の形をご提案させていただきます。
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="企業への提案内容を記載してください（最大1000文字）"
            maxLength={1000}
            rows={8}
            required
            className="w-full px-4 py-3 border border-[#E6ECF3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent resize-none text-sm leading-relaxed"
          />
          <p className="text-xs text-[#666666] mt-2 text-right">
            {message.length} / 1000 文字
          </p>
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={!message.trim() || isSubmitting}
          className="w-full py-4 bg-[#003366] hover:bg-[#00294f] text-white font-semibold rounded-lg transition-colors disabled:bg-[#E6ECF3] disabled:text-[#666666] disabled:cursor-not-allowed text-base"
        >
          {isSubmitting ? "送信中..." : "提携を申し込む"}
        </button>
      </form>
    </section>
  );
}

