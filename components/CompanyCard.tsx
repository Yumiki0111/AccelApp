"use client";

import { Company } from "@/lib/mockData";
import Image from "next/image";

interface CompanyCardProps {
  company: Company;
  onClick: () => void;
}

export default function CompanyCard({ company, onClick }: CompanyCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden transition-all border border-slate-200/60"
    >
      {/* タグ帯 */}
      <div className="px-3 sm:px-4 py-2 bg-[#E6ECF3] flex gap-1 sm:gap-2 flex-wrap">
        {company.industryTags.slice(0, 3).map((tag, idx) => (
          <span
            key={idx}
            className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white text-[#003366] text-[10px] sm:text-xs font-medium rounded-lg"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* ヒーロー画像 */}
      <div className="relative h-36 sm:h-40 w-full">
        <Image
          src={company.heroImageUrl}
          alt={`${company.name} hero`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 500px"
        />
      </div>

      {/* 本文エリア */}
      <div className="px-4 sm:px-6 py-5 sm:py-6 space-y-4">
        {/* 企業情報 */}
        <div className="flex items-start gap-3 sm:gap-4">
          <Image
            src={company.logoUrl}
            alt={company.name}
            width={52}
            height={52}
            className="rounded-full border border-slate-200"
          />
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="text-sm sm:text-lg font-bold text-[#1F2A44] truncate">
              {company.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#6B7A93] truncate">
              {company.contact.name} ・ {company.contact.role}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-xs sm:text-sm">★</span>
                <span className="text-xs sm:text-sm font-semibold text-[#1F2A44]">
                  {company.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-[#6B7A93]">
                口コミ {company.reviewCount}件
              </span>
            </div>
          </div>
        </div>

        {/* プラン情報 */}
        <div className="space-y-2">
          <h4 className="text-sm sm:text-base font-semibold text-[#1F2A44] leading-snug line-clamp-2">
            {company.plan.title}
          </h4>
          <p className="text-xs sm:text-sm text-[#6B7A93] leading-relaxed line-clamp-2">
            {company.plan.summary}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-[#6B7A93]">
          <span className="flex items-center gap-1">
            💰 {company.conditions.cashSupport.available ? company.conditions.cashSupport.detail : "応相談"}
          </span>
          <span className="flex items-center gap-1">
            🤝 {company.conditions.cohostEvent.available ? "共催可能" : "共催なし"}
          </span>
          <span className="flex items-center gap-1">
            🗺️ {company.coverageArea}
          </span>
        </div>

        {/* CTA */}
        <div className="space-y-2">
          <button className="w-full py-2.5 sm:py-3 bg-[#003366] hover:bg-[#00294f] text-white text-sm sm:text-base font-semibold rounded-2xl transition-colors">
            もっと詳しく
          </button>
          <button
            className="w-full text-center text-xs text-[#003366] font-semibold hover:underline"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            すべての協賛プランを見る
          </button>
        </div>
      </div>
    </div>
  );
}

