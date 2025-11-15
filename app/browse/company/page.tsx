"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import TopFilters from "@/components/TopFilters";
import FeaturedSidebar from "@/components/FeaturedSidebar";
import CompanyListItem from "@/components/CompanyListItem";
import { searchCompanies, type CompanyListItem as CompanyListItemType } from "@/lib/api/companies";

const sortOptions = [
  { value: "rating", label: "評価順" },
  { value: "new", label: "新着順" },
  { value: "reviewCount", label: "レビュー数順" },
] as const;

export default function BrowseCompanyPage() {
  // 検索・フィルタ状態
  const [keyword, setKeyword] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedSponsorshipTypes, setSelectedSponsorshipTypes] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"rating" | "new" | "reviewCount">("rating");
  
  // データ状態
  const [companies, setCompanies] = useState<CompanyListItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

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

  // APIから企業データを取得
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await searchCompanies({
          keyword: keyword || undefined,
          industries: selectedIndustries.length > 0 ? selectedIndustries : undefined,
          sponsorshipTypes: selectedSponsorshipTypes.length > 0 ? selectedSponsorshipTypes : undefined,
          regions: selectedRegions.length > 0 ? selectedRegions : undefined,
          sort: sortBy,
          page,
          limit: 20,
        });
        
        setCompanies(result.companies);
        setTotal(result.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : '企業データの取得に失敗しました');
        console.error('企業データの取得エラー:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [keyword, selectedIndustries, selectedSponsorshipTypes, selectedRegions, sortBy, page]);

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
                  onChange={(e) => setSortBy(e.target.value as "rating" | "new" | "reviewCount")}
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
                検索結果 <span className="font-bold text-[#003366]">{total}件</span> {companies.length > 0 ? `1〜${companies.length}件を表示中` : ''}
              </p>
            </div>

            {/* エラー表示 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* ローディング表示 */}
            {loading && (
              <div className="bg-white rounded-lg p-16 text-center">
                <p className="text-[#666666] text-lg">読み込み中...</p>
              </div>
            )}

            {/* 企業リスト */}
            {!loading && !error && companies.length > 0 && (
              <div className="space-y-4">
                {companies.map((company) => (
                  <CompanyListItem
                    key={company.id}
                    company={company}
                  />
                ))}
              </div>
            )}

            {/* 結果なし */}
            {!loading && !error && companies.length === 0 && (
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
              companies={companies.filter((c) => c.rating >= 4.8)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
