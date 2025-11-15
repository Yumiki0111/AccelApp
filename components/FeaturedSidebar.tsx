"use client";

import { type CompanyListItem } from "@/lib/api/companies";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface FeaturedSidebarProps {
  companies: CompanyListItem[];
  onSelectCompany?: (company: CompanyListItem) => void;
}

export default function FeaturedSidebar({ companies, onSelectCompany }: FeaturedSidebarProps) {
  const router = useRouter();

  const handleCompanyClick = (company: CompanyListItem) => {
    if (onSelectCompany) {
      onSelectCompany(company);
    } else {
      router.push(`/browse/company/${company.id}`);
    }
  };
  return (
    <aside className="bg-white border border-[#E6ECF3] rounded-lg shadow-sm w-full xl:sticky xl:top-[88px]">
      <div className="p-4 bg-[#F9F9F9] rounded-t-lg">
        <div className="bg-[#003366] text-white px-4 py-3 rounded-lg mb-4">
          <h3 className="font-bold text-center">積極採用中の企業募集</h3>
        </div>

        <div className="space-y-4">
          {companies.slice(0, 3).map((company) => (
            <div
              key={company.id}
              onClick={() => handleCompanyClick(company)}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="relative h-32 bg-[#E6ECF3]">
                {company.heroImageUrl ? (
                  <Image
                    src={company.heroImageUrl}
                    alt={`${company.name} hero`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#666666] text-xs">
                    画像なし
                  </div>
                )}
                {company.logoUrl && (
                  <div className="absolute top-2 left-2">
                    <Image
                      src={company.logoUrl}
                      alt={company.name}
                      width={40}
                      height={40}
                      className="rounded-lg bg-white p-1"
                    />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-[#666666] mb-1">{company.name}</p>
                <div className="space-y-2 mb-2">
                  <div>
                    <p className="text-[10px] text-[#666666] mb-1">どんなことに取り組んでいるか</p>
                    <p className="text-xs text-[#333333] line-clamp-2">
                      {company.plan.summary || '説明がありません'}
                    </p>
                  </div>
                  {company.coverageArea && (
                    <div>
                      <p className="text-[10px] text-[#666666] mb-1">対応エリア</p>
                      <p className="text-xs text-[#333333]">
                        {company.coverageArea}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {company.industryTags.slice(0, 2).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-[#E6ECF3] text-[#003366] text-[10px] rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="w-full mt-3 py-2 bg-[#003366] hover:bg-[#00294f] text-white text-xs font-semibold rounded-lg transition-colors">
                  詳しく見る →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

