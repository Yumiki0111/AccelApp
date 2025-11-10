"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import FilterTabs from "@/components/FilterTabs";
import CompanyCard from "@/components/CompanyCard";
import CompanyDetailModal from "@/components/CompanyDetailModal";
import SuccessModal from "@/components/SuccessModal";
import {
  mockCompanies,
  industryOptions,
  sponsorshipTypeOptions,
  regionOptions,
  sortOptions,
  Company,
} from "@/lib/mockData";

export default function BrowseCompanyPage() {
  // 検索・フィルタ状態
  const [keyword, setKeyword] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedSponsorshipTypes, setSelectedSponsorshipTypes] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("rating");

  // モーダル状態
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedCompanyName, setSubmittedCompanyName] = useState("");

  // フィルタ切り替え
  const toggleFilter = (type: "industry" | "sponsorship" | "region", value: string) => {
    const setters = {
      industry: setSelectedIndustries,
      sponsorship: setSelectedSponsorshipTypes,
      region: setSelectedRegions,
    };
    const getters = {
      industry: selectedIndustries,
      sponsorship: selectedSponsorshipTypes,
      region: selectedRegions,
    };

    const current = getters[type];
    const setter = setters[type];

    if (current.includes(value)) {
      setter(current.filter((v) => v !== value));
    } else {
      setter([...current, value]);
    }
  };

  // フィルタ適用＆並び替え
  const filteredCompanies = useMemo(() => {
    let result = mockCompanies;

    // キーワード検索
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(lowerKeyword) ||
          c.plan.title.toLowerCase().includes(lowerKeyword) ||
          c.plan.summary.toLowerCase().includes(lowerKeyword)
      );
    }

    // 業界フィルタ
    if (selectedIndustries.length > 0) {
      result = result.filter((c) =>
        c.industryTags.some((tag) => selectedIndustries.includes(tag))
      );
    }

    // 協賛タイプフィルタ
    if (selectedSponsorshipTypes.length > 0) {
      result = result.filter((c) =>
        c.sponsorshipTypes.some((type) => selectedSponsorshipTypes.includes(type))
      );
    }

    // 地域フィルタ
    if (selectedRegions.length > 0) {
      result = result.filter((c) =>
        selectedRegions.some((region) => c.coverageArea.includes(region))
      );
    }

    // 並び替え
    if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "reviewCount") {
      result = [...result].sort((a, b) => b.reviewCount - a.reviewCount);
    }
    // new は現状ランダムのまま

    return result;
  }, [keyword, selectedIndustries, selectedSponsorshipTypes, selectedRegions, sortBy]);

  // 提案送信
  const handleSubmitProposal = (message: string) => {
    console.log("提案送信:", selectedCompany?.name, message);
    setSubmittedCompanyName(selectedCompany?.name || "");
    setSelectedCompany(null);
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* タイトル */}
        <h1 className="text-3xl font-bold text-[#333333] mb-8">
          協賛・共創できる企業を探す
        </h1>

        {/* 検索バー */}
        <div className="mb-8">
          <SearchBar value={keyword} onChange={setKeyword} />
        </div>

        {/* フィルタタブ */}
        <div className="space-y-6 mb-8">
          <FilterTabs
            title="業界"
            options={industryOptions}
            selected={selectedIndustries}
            onToggle={(v) => toggleFilter("industry", v)}
          />
          <FilterTabs
            title="協賛タイプ"
            options={sponsorshipTypeOptions}
            selected={selectedSponsorshipTypes}
            onToggle={(v) => toggleFilter("sponsorship", v)}
          />
          <FilterTabs
            title="地域"
            options={regionOptions}
            selected={selectedRegions}
            onToggle={(v) => toggleFilter("region", v)}
          />
        </div>

        {/* 並び替えドロップダウン */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#666666]">
            {filteredCompanies.length} 件の企業が見つかりました
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-[#E6ECF3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 企業カードグリッド */}
        {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onClick={() => setSelectedCompany(company)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[#666666] text-lg">
              条件に一致する企業が見つかりませんでした
            </p>
            <p className="text-[#666666] text-sm mt-2">
              別のキーワードやフィルタをお試しください
            </p>
          </div>
        )}
      </main>

      {/* 企業詳細モーダル */}
      {selectedCompany && (
        <CompanyDetailModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onSubmitProposal={handleSubmitProposal}
        />
      )}

      {/* 送信完了モーダル */}
      {showSuccessModal && (
        <SuccessModal
          companyName={submittedCompanyName}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
}

