"use client";

import { type CompanyListItem } from "@/lib/api/companies";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CompanyCardProps {
  company: CompanyListItem;
  onClick?: () => void;
}

export default function CompanyCard({ company, onClick }: CompanyCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/browse/company/${company.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
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
      <div className="relative h-36 sm:h-40 w-full bg-[#E6ECF3]">
        {company.heroImageUrl ? (
          <Image
            src={company.heroImageUrl}
            alt={`${company.name} hero`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 500px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#666666] text-sm">
            画像なし
          </div>
        )}
      </div>

      {/* 本文エリア */}
      <div className="px-4 sm:px-6 py-5 sm:py-6 space-y-4">
        {/* 企業情報 */}
        <div className="flex items-start gap-3 sm:gap-4">
          {company.logoUrl ? (
            <Image
              src={company.logoUrl}
              alt={company.name}
              width={52}
              height={52}
              className="rounded-full border border-slate-200"
            />
          ) : (
            <div className="w-[52px] h-[52px] rounded-full bg-[#E6ECF3] flex items-center justify-center border border-slate-200">
              <span className="text-[#003366] font-semibold text-xs">ロゴ</span>
            </div>
          )}
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="text-sm sm:text-lg font-bold text-[#1F2A44] truncate">
              {company.name}
            </h3>
          </div>
        </div>

        {/* どんなことに取り組んでいるか */}
        <div className="space-y-2">
          <h4 className="text-xs sm:text-sm font-semibold text-[#666666]">
            どんなことに取り組んでいるか
          </h4>
          <p className="text-xs sm:text-sm text-[#6B7A93] leading-relaxed line-clamp-2">
            {company.plan.summary || '説明がありません'}
          </p>
        </div>
        
        {company.coverageArea && (
          <div className="space-y-2">
            <h4 className="text-xs sm:text-sm font-semibold text-[#666666]">
              対応エリア
            </h4>
            <p className="text-xs sm:text-sm text-[#6B7A93] leading-relaxed">
              {company.coverageArea}
            </p>
          </div>
        )}

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

