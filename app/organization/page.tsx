"use client";

import Header from "@/components/Header";
import {
  getOrganizationDashboard,
  getAppliedCompanies,
  getKeptCompanies,
  getBrowsedCompanies,
  type OrganizationDashboard as OrganizationDashboardType,
  type AppliedCompany,
  type KeptCompany,
  type BrowsedCompany,
} from "@/lib/api/organizations";
import { getChatRooms, type ChatRoom } from "@/lib/api/chat";
import { getSession, type User } from "@/lib/api/auth";
import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const badgeStyles: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  invited: "bg-slate-100 text-slate-600",
};

const statusLabel: Record<string, string> = {
  active: "アクティブ",
  pending: "審査中",
  invited: "招待中",
};

type TabType = "dashboard" | "messages" | "applied" | "kept" | "history";

export default function OrganizationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  // 認証状態
  const [user, setUser] = useState<User | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // データ状態
  const [dashboardData, setDashboardData] = useState<OrganizationDashboardType | null>(null);
  const [appliedCompanies, setAppliedCompanies] = useState<AppliedCompany[]>([]);
  const [keptCompanies, setKeptCompanies] = useState<KeptCompany[]>([]);
  const [browsedCompanies, setBrowsedCompanies] = useState<BrowsedCompany[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 認証情報を取得
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { user: sessionUser } = await getSession();
        if (!sessionUser) {
          // 未ログインの場合はログインページにリダイレクト
          router.push('/login?redirect=/organization');
          return;
        }

        if (sessionUser.userType !== 'organization') {
          // 組織ユーザーでない場合はエラー
          setError('このページは組織ユーザーのみアクセス可能です');
          setAuthLoading(false);
          return;
        }

        if (!sessionUser.organizationId) {
          // 組織IDが取得できない場合はエラー
          setError('組織情報が見つかりません');
          setAuthLoading(false);
          return;
        }

        setUser(sessionUser);
        setOrganizationId(sessionUser.organizationId);
      } catch (err) {
        console.error('セッション取得エラー:', err);
        setError('認証情報の取得に失敗しました');
        router.push('/login?redirect=/organization');
      } finally {
        setAuthLoading(false);
      }
    };

    fetchSession();
  }, [router]);

  // クエリパラメータからタブを取得
  useEffect(() => {
    const tab = searchParams.get("tab") as TabType | null;
    if (tab && ["dashboard", "messages", "applied", "kept", "history"].includes(tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab("dashboard");
    }
  }, [searchParams]);

  // ダッシュボードデータを取得
  useEffect(() => {
    if (!organizationId) return;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await getOrganizationDashboard(organizationId);
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('ダッシュボードデータの取得エラー:', err);
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [organizationId]);

  // 応募済み企業を取得
  useEffect(() => {
    if (!organizationId || activeTab !== "applied") return;

    const fetchApplied = async () => {
      try {
        const data = await getAppliedCompanies(organizationId);
        setAppliedCompanies(data);
      } catch (err) {
        console.error('応募済み企業の取得エラー:', err);
      }
    };
    fetchApplied();
  }, [activeTab, organizationId]);

  // キープ企業を取得
  useEffect(() => {
    if (!organizationId || activeTab !== "kept") return;

    const fetchKept = async () => {
      try {
        const data = await getKeptCompanies(organizationId);
        setKeptCompanies(data);
      } catch (err) {
        console.error('キープ企業の取得エラー:', err);
      }
    };
    fetchKept();
  }, [activeTab, organizationId]);

  // 閲覧履歴を取得
  useEffect(() => {
    if (!organizationId || activeTab !== "history") return;

    const fetchBrowsed = async () => {
      try {
        const data = await getBrowsedCompanies(organizationId);
        setBrowsedCompanies(data);
      } catch (err) {
        console.error('閲覧履歴の取得エラー:', err);
      }
    };
    fetchBrowsed();
  }, [activeTab, organizationId]);

  // チャットルームを取得
  useEffect(() => {
    if (!organizationId || activeTab !== "messages") return;

    const fetchChatRooms = async () => {
      try {
        const data = await getChatRooms({ organizationId });
        setChatRooms(data);
      } catch (err) {
        console.error('チャットルームの取得エラー:', err);
      }
    };
    fetchChatRooms();
  }, [activeTab, organizationId]);

  // 初期ローディング完了
  useEffect(() => {
    if (dashboardData !== null) {
      setLoading(false);
    }
  }, [dashboardData]);

  // タブ変更時の処理
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === "dashboard") {
      router.push("/organization");
    } else {
      router.push(`/organization?tab=${tab}`);
    }
  };

  const [showAllMembers, setShowAllMembers] = useState(false);
  const visibleMembers = useMemo(
    () => dashboardData ? (showAllMembers ? dashboardData.members : dashboardData.members.slice(0, 4)) : [],
    [showAllMembers, dashboardData]
  );

  const tabs = [
    { id: "dashboard" as TabType, label: "ダッシュボード" },
    { id: "messages" as TabType, label: "メッセージボックス", count: chatRooms.filter(r => r.organizationUnreadCount > 0).length },
    { id: "applied" as TabType, label: "応募済み", count: appliedCompanies.length },
    { id: "kept" as TabType, label: "キープ一覧", count: keptCompanies.length },
    { id: "history" as TabType, label: "閲覧履歴", count: browsedCompanies.length },
  ];

  return (
    <>
      <Header />
      <main className="bg-[#F5F7FA] min-h-screen pb-16">
      <div className="lg:max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* タブナビゲーション（デスクトップのみ） */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="flex overflow-x-auto scrollbar-hide border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors relative ${
                  activeTab === tab.id
                    ? "text-[#003366] border-b-2 border-[#003366]"
                    : "text-[#6B7A93] hover:text-[#003366]"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-2 py-0.5 bg-[#003366] text-white text-xs font-semibold rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* タブコンテンツ */}
        {!loading && !error && dashboardData && activeTab === "dashboard" && (
          <>
        {/* プロフィール */}
        <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-3">
              <p className="text-sm text-[#003366]/70 font-medium">登録団体</p>
              <h1 className="text-3xl font-bold text-[#003366]">
                {dashboardData.profile.name}
              </h1>
              <p className="text-lg text-[#4A5B73]">
                {dashboardData.profile.tagline || ''}
              </p>
              <p className="text-sm text-[#6B7A93] max-w-3xl leading-relaxed">
                {dashboardData.profile.description || ''}
              </p>
            </div>
            <div className="bg-[#003366] text-white rounded-xl p-4 sm:p-6 space-y-3 shadow-md">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/70">
                  参加コード
                </p>
                <p className="text-2xl font-semibold tracking-wider">
                  {dashboardData.profile.joinCode}
                </p>
              </div>
              <div className="text-sm text-white/80 space-y-1">
                {dashboardData.profile.campus && <p>拠点：{dashboardData.profile.campus}</p>}
                <p>設立：{new Date(dashboardData.profile.createdAt).toLocaleDateString('ja-JP')}</p>
              </div>
              <div className="text-xs text-white/60 space-y-1">
                <p>連絡先：{dashboardData.profile.contactEmail}</p>
                {dashboardData.profile.contactPhone && <p>電話：{dashboardData.profile.contactPhone}</p>}
              </div>
            </div>
          </div>
        </section>

        {/* インサイト（一時的に非表示 - 将来実装） */}
        {/* <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {dashboardData.insights.map((insight) => (
            <div
              key={insight.label}
              className="bg-white rounded-2xl shadow-sm p-5 space-y-3 border border-slate-100"
            >
              <p className="text-sm font-semibold text-[#003366]">
                {insight.label}
              </p>
              <p className="text-3xl font-bold text-[#1F2A44]">
                {insight.value}
              </p>
              {insight.trend && (
                <p
                  className={`text-xs font-medium ${
                    insight.trend.type === "up"
                      ? "text-emerald-600"
                      : insight.trend.type === "down"
                      ? "text-rose-500"
                      : "text-[#6B7A93]"
                  }`}
                >
                  {insight.trend.description}
                </p>
              )}
              <p className="text-xs text-[#6B7A93] leading-relaxed">
                {insight.description}
              </p>
            </div>
          ))}
        </section>

        {/* メンバー一覧 */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#1F2A44]">
                メンバー一覧
              </h2>
              <span className="text-sm text-[#6B7A93]">
                アクティブ {dashboardData.members.length}名
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {visibleMembers.map((member) => (
                <div key={member.id} className="py-3 sm:py-4 flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#003366]/10 text-[#003366] flex items-center justify-center font-semibold">
                      {member.userId.slice(0, 1).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[#1F2A44]">
                        メンバー ({member.userId.slice(0, 8)}...)
                      </p>
                      <span className="text-xs bg-[#003366]/10 text-[#003366] px-2 py-0.5 rounded-full">
                        {member.role}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7A93]">
                      {member.university && `${member.university} `}
                      {member.faculty && `${member.faculty} `}
                      {member.department && `${member.department} `}
                      {member.grade && `${member.grade}年生`}
                    </p>
                  </div>
                  <div className="text-right text-xs text-[#6B7A93]">
                    参加日
                    <br />
                    <span className="font-medium text-[#1F2A44]/80">
                      {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString('ja-JP') : '-'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {dashboardData.members.length > 4 && (
              <div className="pt-4">
                <button
                  onClick={() => setShowAllMembers((prev) => !prev)}
                  className="w-full border border-slate-200 text-sm text-[#003366] font-semibold py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {showAllMembers
                    ? "メンバー一覧を折りたたむ"
                    : `全員表示 (${dashboardData.members.length}名)`}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-slate-100">
            <h2 className="text-xl font-semibold text-[#1F2A44]">
              参加リクエスト
            </h2>
            {dashboardData.pendingRequests.length === 0 ? (
              <p className="text-sm text-[#6B7A93]">
                現在承認待ちのメンバーはいません。
              </p>
            ) : (
              <div className="space-y-3">
                {dashboardData.pendingRequests.map((member) => (
                  <div
                    key={member.id}
                    className="border border-slate-200 rounded-xl p-4 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-semibold">
                        {member.userId.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1F2A44]">
                          メンバー ({member.userId.slice(0, 8)}...)
                        </p>
                        <p className="text-xs text-[#6B7A93]">
                          {member.university && `${member.university} `}
                          {member.faculty && `${member.faculty} `}
                          {member.department && `${member.department} `}
                          {member.grade && `${member.grade}年生`}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7A93]">
                      <span
                        className={`px-2 py-0.5 rounded-full ${
                          badgeStyles[member.status]
                        }`}
                      >
                        {statusLabel[member.status]}
                      </span>
                      <span>役割：{member.role}</span>
                      {member.joinedAt && (
                        <span>参加日：{new Date(member.joinedAt).toLocaleDateString('ja-JP')}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-[#003366] hover:bg-[#00294f] text-white text-sm font-semibold py-2 rounded-lg transition-colors">
                        承認する
                      </button>
                      <button className="flex-1 border border-slate-200 text-sm text-[#003366] font-semibold py-2 rounded-lg hover:bg-slate-50 transition-colors">
                        保留 / 拒否
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 協賛サマリー（一時的に非表示 - 応募済みタブで確認可能） */}

          </>
        )}

        {activeTab === "messages" && (
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-slate-100">
            <h2 className="text-xl font-semibold text-[#1F2A44] mb-4">メッセージボックス</h2>
            {chatRooms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#6B7A93] mb-4">メッセージはありません</p>
                <button
                  onClick={() => router.push("/browse/company")}
                  className="px-6 py-2 bg-[#003366] hover:bg-[#00294f] text-white font-semibold rounded-lg transition-colors"
                >
                  企業を探す
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {chatRooms.map((room) => {
                  const lastMessage = room.messages[room.messages.length - 1];
                  return (
                    <div
                      key={room.id}
                      onClick={() => router.push(`/chat/${room.companyId}`)}
                      className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-full bg-[#E6ECF3] flex items-center justify-center flex-shrink-0">
                          <span className="text-[#003366] font-semibold">企業</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-[#333333] truncate">
                                企業ID: {room.companyId.slice(0, 8)}...
                              </h3>
                            </div>
                            <div className="flex flex-col items-end gap-1 ml-2">
                              {room.lastMessageAt && (
                                <span className="text-xs text-[#666666] whitespace-nowrap">
                                  {new Date(room.lastMessageAt).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
                                </span>
                              )}
                              {room.organizationUnreadCount > 0 && (
                                <span className="px-2 py-0.5 bg-[#003366] text-white text-xs font-semibold rounded-full">
                                  {room.organizationUnreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                          {lastMessage && (
                            <p className="text-sm text-[#666666] line-clamp-2 mt-2">
                              {lastMessage.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "applied" && (
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-slate-100">
            <h2 className="text-xl font-semibold text-[#1F2A44] mb-4">応募済み</h2>
            {appliedCompanies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#6B7A93] mb-4">応募済みの企業はありません</p>
                <button
                  onClick={() => router.push("/browse/company")}
                  className="px-6 py-2 bg-[#003366] hover:bg-[#00294f] text-white font-semibold rounded-lg transition-colors"
                >
                  企業を探す
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {appliedCompanies.map((applied) => {
                  const statusColors = {
                    "申請済み": "bg-blue-100 text-blue-700",
                    "審査中": "bg-amber-100 text-amber-700",
                    "承認済み": "bg-emerald-100 text-emerald-700",
                    "却下": "bg-red-100 text-red-700",
                  };
                  return (
                    <div
                      key={applied.id}
                      className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        {applied.companyLogoUrl ? (
                          <Image
                            src={applied.companyLogoUrl}
                            alt={applied.companyName}
                            width={64}
                            height={64}
                            className="rounded-full flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-[#E6ECF3] flex items-center justify-center flex-shrink-0">
                            <span className="text-[#003366] font-semibold text-xs">ロゴ</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-[#333333] mb-1">
                                {applied.companyName}
                              </h3>
                              <p className="text-sm text-[#666666] mb-2">
                                {applied.planTitle}
                              </p>
                            </div>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ml-2 ${statusColors[applied.status]}`}>
                              {applied.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-[#666666] mb-2">
                            <span>応募日: {new Date(applied.appliedDate).toLocaleDateString("ja-JP")}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/chat/${applied.companyId}`);
                              }}
                              className="flex-1 px-4 py-2 bg-[#003366] hover:bg-[#00294f] text-white text-sm font-semibold rounded-lg transition-colors"
                            >
                              チャットでやり取り
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/browse/company/${applied.companyId}`);
                              }}
                              className="flex-1 px-4 py-2 border border-slate-200 text-[#003366] text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              企業詳細
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "kept" && (
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-slate-100">
            <h2 className="text-xl font-semibold text-[#1F2A44] mb-4">キープ一覧</h2>
            {keptCompanies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#6B7A93] mb-4">キープした企業はありません</p>
                <button
                  onClick={() => router.push("/browse/company")}
                  className="px-6 py-2 bg-[#003366] hover:bg-[#00294f] text-white font-semibold rounded-lg transition-colors"
                >
                  企業を探す
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {keptCompanies.map((kept) => (
                  <div
                    key={kept.id}
                    className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {kept.companyLogoUrl ? (
                        <Image
                          src={kept.companyLogoUrl}
                          alt={kept.companyName}
                          width={48}
                          height={48}
                          className="rounded-full flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#E6ECF3] flex items-center justify-center flex-shrink-0">
                          <span className="text-[#003366] font-semibold text-xs">ロゴ</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-[#333333] truncate mb-1">
                          {kept.companyName}
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-yellow-500 text-xs">★</span>
                          <span className="text-xs font-semibold text-[#333333]">
                            {kept.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-[#666666] mb-3 line-clamp-2">
                      {kept.planTitle}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {kept.industryTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-[#E6ECF3] text-[#003366] text-xs rounded"
                        >
                          {tag}
                      </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/browse/company/${kept.companyId}`);
                        }}
                        className="flex-1 px-4 py-2 bg-[#003366] hover:bg-[#00294f] text-white text-sm font-semibold rounded-lg transition-colors"
                      >
                        詳細を見る
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // キープ解除の処理
                        }}
                        className="px-4 py-2 border border-slate-200 text-[#666666] text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        解除
                      </button>
                    </div>
                  </div>
              ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-slate-100">
            <h2 className="text-xl font-semibold text-[#1F2A44] mb-4">閲覧履歴</h2>
            {browsedCompanies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#6B7A93] mb-4">閲覧履歴はありません</p>
                <button
                  onClick={() => router.push("/browse/company")}
                  className="px-6 py-2 bg-[#003366] hover:bg-[#00294f] text-white font-semibold rounded-lg transition-colors"
                >
                  企業を探す
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {browsedCompanies.map((browsed) => (
                  <div
                    key={browsed.id}
                    onClick={() => router.push(`/browse/company/${browsed.companyId}`)}
                    className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      {browsed.companyLogoUrl ? (
                        <Image
                          src={browsed.companyLogoUrl}
                          alt={browsed.companyName}
                          width={56}
                          height={56}
                          className="rounded-full flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-[#E6ECF3] flex items-center justify-center flex-shrink-0">
                          <span className="text-[#003366] font-semibold text-xs">ロゴ</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-[#333333] mb-1">
                              {browsed.companyName}
                            </h3>
                            <p className="text-sm text-[#666666] mb-2">
                              {browsed.planTitle}
                            </p>
                          </div>
                          <span className="text-xs text-[#666666] whitespace-nowrap ml-2">
                            {new Date(browsed.browsedDate).toLocaleDateString("ja-JP", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500 text-xs">★</span>
                            <span className="text-xs font-semibold text-[#333333]">
                              {browsed.rating.toFixed(1)}
                    </span>
                  </div>
                          <div className="flex flex-wrap gap-1">
                            {browsed.industryTags.map((tag: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-[#E6ECF3] text-[#003366] text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}
      </div>
      </main>
    </>
  );
}

