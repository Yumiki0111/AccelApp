"use client";

import { type CompanyDetail } from "@/lib/api/companies";
import Image from "next/image";
import { useState } from "react";

interface CompanyDetailModalProps {
  company: CompanyDetail;
  onClose: () => void;
  onSubmitProposal: (message: string) => void;
}

export default function CompanyDetailModal({
  company,
  onClose,
  onSubmitProposal,
}: CompanyDetailModalProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    // 送信シミュレーション
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSubmitProposal(message);
    setIsSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b border-[#E6ECF3] p-6 flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            {company.logoUrl ? (
              <Image
                src={company.logoUrl}
                alt={company.name}
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#E6ECF3] flex items-center justify-center">
                <span className="text-[#003366] font-semibold text-xs">ロゴ</span>
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#333333]">
                {company.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#666666] hover:text-[#333333] text-2xl font-bold ml-4"
          >
            ×
          </button>
        </div>

        {/* 本文 */}
        <div className="p-6 space-y-8">
          {/* 企業情報 */}
          <section>
            <div className="space-y-6">
              {company.philosophy && (
                <div>
                  <h3 className="text-lg font-bold text-[#333333] mb-3">
                    どんな会社か
                  </h3>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    {company.philosophy}
                  </p>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-bold text-[#333333] mb-3">
                  どんなことに取り組んでいるか
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  {company.plan.summary || '説明がありません'}
                </p>
              </div>
              
              {company.coverageArea && (
                <div>
                  <h3 className="text-lg font-bold text-[#333333] mb-3">
                    対応エリア
                  </h3>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    {company.coverageArea}
                  </p>
                </div>
              )}
              
              {company.achievements && company.achievements.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-[#333333] mb-3">
                    実績
                  </h3>
                  <div className="space-y-4">
                    {company.achievements.map((achievement) => (
                      <div key={achievement.id} className="border border-[#E6ECF3] rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          {achievement.logoUrl && (
                            <Image
                              src={achievement.logoUrl}
                              alt={achievement.organizationName}
                              width={48}
                              height={48}
                              className="rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-[#333333] mb-1">
                              {achievement.organizationName}
                            </p>
                            <p className="text-sm text-[#003366] mb-2">
                              {achievement.eventName}
                            </p>
                            {achievement.description && (
                              <p className="text-xs text-[#666666]">
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
          </section>

          {/* 応募/提案フォーム */}
          <section>
            <h3 className="text-lg font-bold text-[#333333] mb-4">
              提携を申し込む
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 団体情報（自動入力） */}
              <div className="p-4 bg-[#E6ECF3] rounded-xl">
                <p className="text-sm text-[#666666] mb-2">申込団体</p>
                <p className="font-semibold text-[#333333]">
                  サンプル学生団体
                </p>
                <p className="text-sm text-[#666666] mt-1">
                  代表：山田太郎 / sample@example.com
                </p>
              </div>

              {/* 提案メッセージ */}
              <div>
                <label className="block text-sm font-semibold text-[#333333] mb-2">
                  提案メッセージ <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="企業への提案内容を記載してください（最大1000文字）"
                  maxLength={1000}
                  rows={6}
                  required
                  className="w-full px-4 py-3 border border-[#E6ECF3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent resize-none"
                />
                <p className="text-xs text-[#666666] mt-1 text-right">
                  {message.length} / 1000 文字
                </p>
              </div>

              {/* 送信ボタン */}
              <button
                type="submit"
                disabled={!message.trim() || isSubmitting}
                className="w-full py-4 bg-[#003366] hover:bg-[#00294f] text-white font-bold rounded-2xl transition-colors disabled:bg-[#E6ECF3] disabled:text-[#666666] disabled:cursor-not-allowed"
              >
                {isSubmitting ? "送信中..." : "提携を申し込む"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

