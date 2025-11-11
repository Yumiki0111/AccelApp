"use client";

import Header from "@/components/Header";
import { mockOrganizationDashboard } from "@/lib/orgMock";
import { Fragment, useMemo, useState } from "react";

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

export default function OrganizationPage() {
  const data = mockOrganizationDashboard;
  const [showAllMembers, setShowAllMembers] = useState(false);
  const visibleMembers = useMemo(
    () => (showAllMembers ? data.members : data.members.slice(0, 4)),
    [showAllMembers, data.members]
  );

  return (
    <>
      <Header />
      <main className="bg-[#F5F7FA] min-h-screen pb-16">
      <div className="lg:max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* プロフィール */}
        <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-3">
              <p className="text-sm text-[#003366]/70 font-medium">登録団体</p>
              <h1 className="text-3xl font-bold text-[#003366]">
                {data.profile.name}
              </h1>
              <p className="text-lg text-[#4A5B73]">
                {data.profile.tagline}
              </p>
              <p className="text-sm text-[#6B7A93] max-w-3xl leading-relaxed">
                {data.profile.description}
              </p>
            </div>
            <div className="bg-[#003366] text-white rounded-xl p-4 sm:p-6 space-y-3 shadow-md">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/70">
                  参加コード
                </p>
                <p className="text-2xl font-semibold tracking-wider">
                  {data.profile.joinCode}
                </p>
              </div>
              <div className="text-sm text-white/80 space-y-1">
                <p>拠点：{data.profile.campus}</p>
                <p>設立：{data.profile.createdAt}</p>
                <p>{data.profile.contacts.representative}</p>
              </div>
              <div className="text-xs text-white/60 space-y-1">
                <p>連絡先：{data.profile.contacts.email}</p>
                <p>電話：{data.profile.contacts.phone}</p>
              </div>
            </div>
          </div>
        </section>

        {/* インサイト */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {data.insights.map((insight) => (
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
                アクティブ {data.members.length}名
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {visibleMembers.map((member) => (
                <div key={member.id} className="py-3 sm:py-4 flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#003366]/10 text-[#003366] flex items-center justify-center font-semibold">
                      {member.name.slice(0, 1)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[#1F2A44]">
                        {member.name}
                      </p>
                      <span className="text-xs bg-[#003366]/10 text-[#003366] px-2 py-0.5 rounded-full">
                        {member.role}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7A93]">{member.email}</p>
                  </div>
                  <div className="text-right text-xs text-[#6B7A93]">
                    最終アクセス
                    <br />
                    <span className="font-medium text-[#1F2A44]/80">
                      {member.lastActive}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {data.members.length > 4 && (
              <div className="pt-4">
                <button
                  onClick={() => setShowAllMembers((prev) => !prev)}
                  className="w-full border border-slate-200 text-sm text-[#003366] font-semibold py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {showAllMembers
                    ? "メンバー一覧を折りたたむ"
                    : `全員表示 (${data.members.length}名)`}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-slate-100">
            <h2 className="text-xl font-semibold text-[#1F2A44]">
              参加リクエスト
            </h2>
            {data.pendingRequests.length === 0 ? (
              <p className="text-sm text-[#6B7A93]">
                現在承認待ちのメンバーはいません。
              </p>
            ) : (
              <div className="space-y-3">
                {data.pendingRequests.map((member) => (
                  <div
                    key={member.id}
                    className="border border-slate-200 rounded-xl p-4 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-semibold">
                        {member.name.slice(0, 1)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1F2A44]">
                          {member.name}
                        </p>
                        <p className="text-xs text-[#6B7A93]">
                          {member.email}
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
                      <span>希望役割：{member.role}</span>
                      <span>状況：{member.lastActive}</span>
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

        {/* 協賛サマリー */}
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[#1F2A44]">
                協賛応募の状況
              </h2>
              <p className="text-sm text-[#6B7A93]">
                直近の応募・交渉状況を確認し、次のアクションを決めましょう。
              </p>
            </div>
            <button className="bg-[#003366] hover:bg-[#00294f] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              新しい協賛を探す
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.sponsorships.map((deal) => (
              <div
                key={deal.id}
                className="border border-slate-200 rounded-xl p-4 space-y-3"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#003366]">
                    {deal.company}
                  </p>
                  <h3 className="text-base font-bold text-[#1F2A44] line-clamp-2">
                    {deal.title}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7A93]">
                  <span className="bg-[#003366]/10 text-[#003366] px-2 py-0.5 rounded-full">
                    {deal.status}
                  </span>
                  <span>最終更新：{deal.lastUpdate}</span>
                </div>
                <p className="text-sm text-[#1F2A44]/80">{deal.valueEstimate}</p>
                <button className="w-full border border-slate-200 text-sm text-[#003366] font-semibold py-2 rounded-lg hover:bg-slate-50 transition-colors">
                  詳細を見る
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* オンボーディング / インサイト */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-slate-100">
            <h2 className="text-xl font-semibold text-[#1F2A44]">
              アカウント認証 & 団体参加ステップ
            </h2>
            <ul className="space-y-3">
              {data.onboarding.map((step) => (
                <li
                  key={step.id}
                  className="flex gap-3 items-start border border-slate-200 rounded-xl p-4"
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
                      step.completed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {step.id}
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-[#1F2A44]">{step.title}</p>
                    <p className="text-sm text-[#6B7A93] leading-relaxed">
                      {step.detail}
                    </p>
                    {step.completed ? (
                      <span className="text-xs text-emerald-600 font-semibold">
                        完了済み
                      </span>
                    ) : (
                      <button className="text-xs text-[#003366] font-semibold hover:underline">
                        手順を確認する
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-slate-100">
            <h2 className="text-xl font-semibold text-[#1F2A44]">
              最新のお知らせ
            </h2>
            <div className="space-y-3">
              {data.announcements.map((item) => (
                <div
                  key={item.id}
                  className="border border-slate-200 rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-[#6B7A93]">
                    <span>{item.date}</span>
                    <span className="text-[#003366]/70 font-semibold">
                      INFO
                    </span>
                  </div>
                  <p className="font-semibold text-[#1F2A44]">{item.title}</p>
                  <div className="whitespace-pre-line text-sm text-[#4A5B73] leading-relaxed">
                    {item.content}
                  </div>
                  <button className="text-xs text-[#003366] font-semibold hover:underline">
                    詳細を見る
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      </main>
    </>
  );
}

