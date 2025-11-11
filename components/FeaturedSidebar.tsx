"use client";

import { Company } from "@/lib/mockData";
import Image from "next/image";

interface FeaturedSidebarProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
}

export default function FeaturedSidebar({ companies, onSelectCompany }: FeaturedSidebarProps) {
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
              onClick={() => onSelectCompany(company)}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="relative h-32">
                <Image
                  src={company.heroImageUrl}
                  alt={`${company.name} hero`}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Image
                    src={company.logoUrl}
                    alt={company.name}
                    width={40}
                    height={40}
                    className="rounded-lg bg-white p-1"
                  />
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-[#666666] mb-1">{company.contact.name}</p>
                <h4 className="text-sm font-bold text-[#003366] line-clamp-2 mb-2">
                  {company.plan.title}
                </h4>
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
                <div className="text-xs text-[#666666] space-y-1">
                  <p>💰 {company.conditions.cashSupport.available ? "金銭協賛あり" : "応相談"}</p>
                  <p>📍 {company.coverageArea}</p>
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

