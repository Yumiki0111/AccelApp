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
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden transition-all"
    >
      {/* タグ帯 */}
      <div className="p-4 bg-[#E6ECF3] flex gap-2 flex-wrap">
        {company.industryTags.slice(0, 3).map((tag, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-white text-[#003366] text-xs font-medium rounded-lg"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 本文エリア */}
      <div className="p-6 space-y-4">
        {/* 企業情報 */}
        <div className="flex items-start gap-4">
          <Image
            src={company.logoUrl}
            alt={company.name}
            width={64}
            height={64}
            className="rounded-full"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-[#333333] truncate">
              {company.name}
            </h3>
            <p className="text-sm text-[#666666]">
              {company.contact.name} ・ {company.contact.role}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="text-sm font-semibold text-[#333333] ml-1">
                  {company.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-[#666666]">
                ({company.reviewCount}件)
              </span>
            </div>
          </div>
        </div>

        {/* プラン情報 */}
        <div className="space-y-2">
          <h4 className="text-base font-bold text-[#333333]">
            {company.plan.title}
          </h4>
          <p className="text-sm text-[#666666] line-clamp-2">
            {company.plan.summary}
          </p>
        </div>

        {/* CTA */}
        <button className="w-full py-3 bg-[#003366] hover:bg-[#00294f] text-white font-semibold rounded-2xl transition-colors">
          もっと詳しく
        </button>

        {/* 下部リンク */}
        <a
          href="#"
          className="block text-center text-xs text-[#003366] hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          すべての協賛プランを見る
        </a>
      </div>
    </div>
  );
}

