"use client";

import { type CompanyListItem as CompanyListItemType } from "@/lib/api/companies";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CompanyListItemProps {
  company: CompanyListItemType;
  onClick?: () => void;
}

export default function CompanyListItem({ company, onClick }: CompanyListItemProps) {
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
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-[#E6ECF3]"
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4">
        {/* 左：画像エリア */}
        <div className="flex-shrink-0">
          <div className="relative w-full sm:w-44 h-40 sm:h-32 rounded-lg overflow-hidden bg-[#E6ECF3]">
            {company.heroImageUrl ? (
              <Image
                src={company.heroImageUrl}
                alt={`${company.name} チーム写真`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#666666] text-sm">
                画像なし
              </div>
            )}
          </div>
        </div>

        {/* 中央：企業情報 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-3">
            {company.logoUrl ? (
              <Image
                src={company.logoUrl}
                alt={company.name}
                width={48}
                height={48}
                className="rounded-lg flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-[#E6ECF3] flex items-center justify-center text-[#666666] text-xs flex-shrink-0">
                ロゴ
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#666666] mb-1 truncate">{company.name}</p>
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

          <div className="space-y-3 mb-3">
            <div>
              <p className="text-xs text-[#666666] mb-1">どんなことに取り組んでいるか</p>
              <p className="text-sm text-[#333333] line-clamp-2">
                {company.plan.summary || '説明がありません'}
              </p>
            </div>
            {company.coverageArea && (
              <div>
                <p className="text-xs text-[#666666] mb-1">対応エリア</p>
                <p className="text-sm text-[#333333]">
                  {company.coverageArea}
                </p>
              </div>
            )}
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

