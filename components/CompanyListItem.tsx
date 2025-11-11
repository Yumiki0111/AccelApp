"use client";

import { Company } from "@/lib/mockData";
import Image from "next/image";

interface CompanyListItemProps {
  company: Company;
  onClick: () => void;
}

export default function CompanyListItem({ company, onClick }: CompanyListItemProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-[#E6ECF3]"
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4">
        {/* 左：画像エリア */}
        <div className="flex-shrink-0">
          <div className="relative w-full sm:w-44 h-40 sm:h-32 rounded-lg overflow-hidden">
            <Image
              src={company.heroImageUrl}
              alt={`${company.name} チーム写真`}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* 中央：企業情報 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            <Image
              src={company.logoUrl}
              alt={company.name}
              width={48}
              height={48}
              className="rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#666666] mb-1 truncate">{company.name}</p>
              <h3 className="text-base sm:text-lg font-bold text-[#003366] mb-1">
                {company.plan.title}
              </h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {company.industryTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-[#E6ECF3] text-[#003366] text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-[#333333] mb-3 line-clamp-2">
            {company.plan.summary}
          </p>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs text-[#666666] mb-3">
            <div className="flex items-center gap-1">
              <span>💰</span>
              <span>{company.conditions.cashSupport.available ? company.conditions.cashSupport.detail : "応相談"}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>📦</span>
              <span>{company.conditions.goodsSupport.available ? "物品提供あり" : "なし"}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>💬</span>
              <span>{company.conditions.mentoring.available ? "メンタリング可" : "なし"}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🤝</span>
              <span>{company.conditions.cohostEvent.available ? "共催可能" : "なし"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="text-sm font-semibold text-[#333333] ml-1">
                  {company.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-[#666666]">({company.reviewCount}件)</span>
            </div>
            <div className="text-xs text-[#666666]">
              📍 {company.coverageArea}
            </div>
          </div>
        </div>

        {/* 右：CTAボタン */}
        <div className="flex-shrink-0 flex flex-col justify-center gap-2 mt-3 sm:mt-0">
          <button className="w-full sm:w-auto px-6 py-3 bg-[#003366] hover:bg-[#00294f] text-white font-semibold rounded-lg transition-colors whitespace-nowrap">
            詳しく見る
          </button>
        </div>
      </div>
    </div>
  );
}

