"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import TopFilters from "@/components/TopFilters";
import FeaturedSidebar from "@/components/FeaturedSidebar";
import CompanyListItem from "@/components/CompanyListItem";
import CompanyDetailModal from "@/components/CompanyDetailModal";
import SuccessModal from "@/components/SuccessModal";
import {
  mockCompanies,
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
  const toggleIndustry = (value: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleSponsorshipType = (value: string) => {
    setSelectedSponsorshipTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleRegion = (value: string) => {
    setSelectedRegions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
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

      <div className="lg:max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* メインコンテンツ */}
          <main className="flex-1 space-y-6">
            <TopFilters
              selectedIndustries={selectedIndustries}
              selectedSponsorshipTypes={selectedSponsorshipTypes}
              selectedRegions={selectedRegions}
              onToggleIndustry={toggleIndustry}
              onToggleSponsorshipType={toggleSponsorshipType}
              onToggleRegion={toggleRegion}
            />

            {/* 検索バー＆並び替え */}
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="キーワードで検索"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E6ECF3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm sm:text-base"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-[#E6ECF3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm sm:text-base"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 検索結果表示 */}
            <div>
              <p className="text-sm text-[#666666]">
                検索結果 <span className="font-bold text-[#003366]">{filteredCompanies.length}件</span> 1〜{Math.min(filteredCompanies.length, 20)}件を表示中
              </p>
            </div>

            {/* 企業リスト */}
            {filteredCompanies.length > 0 ? (
              <div className="space-y-4">
                {filteredCompanies.map((company) => (
                  <CompanyListItem
                    key={company.id}
                    company={company}
                    onClick={() => setSelectedCompany(company)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-16 text-center">
                <p className="text-[#666666] text-lg mb-2">
                  条件に一致する企業が見つかりませんでした
                </p>
                <p className="text-[#666666] text-sm">
                  別のキーワードやフィルタをお試しください
                </p>
              </div>
            )}
          </main>

          {/* 右サイドバー（注目企業） */}
          <div className="w-full xl:w-[280px] xl:flex-none">
            <FeaturedSidebar
              companies={mockCompanies.filter((c) => c.rating >= 4.8)}
              onSelectCompany={setSelectedCompany}
            />
          </div>
        </div>
      </div>

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
