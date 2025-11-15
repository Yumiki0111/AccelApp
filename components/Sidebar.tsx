"use client";

import { getFilters } from "@/lib/api/filters";
import { useState, useEffect } from "react";

interface SidebarProps {
  selectedIndustries: string[];
  selectedSponsorshipTypes: string[];
  selectedRegions: string[];
  onToggleIndustry: (value: string) => void;
  onToggleSponsorshipType: (value: string) => void;
  onToggleRegion: (value: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  selectedIndustries,
  selectedSponsorshipTypes,
  selectedRegions,
  onToggleIndustry,
  onToggleSponsorshipType,
  onToggleRegion,
  isOpen = true,
  onClose,
}: SidebarProps) {
  const [filterOptions, setFilterOptions] = useState<{
    industries: { id: string; label: string }[];
    sponsorshipTypes: { value: string; label: string }[];
    regions: { id: string; code: string; name: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFilters()
      .then(setFilterOptions)
      .catch((error) => {
        console.error('フィルタの取得に失敗しました:', error);
      })
      .finally(() => setLoading(false));
  }, []);
  const FilterSection = ({
    title,
    options,
    selected,
    onToggle,
    icon,
  }: {
    title: string;
    options: string[];
    selected: string[];
    onToggle: (value: string) => void;
    icon: string;
  }) => (
    <div className="mb-6">
      <button className="w-full flex items-center justify-center gap-2 bg-[#003366] text-white py-3 rounded-lg mb-3 font-semibold">
        <span className="text-xl">{icon}</span>
        <span>{title}</span>
      </button>
      <div className="space-y-2 px-2">
        <button
          onClick={() => {
            // すべて選択解除
            selected.forEach((item) => onToggle(item));
          }}
          className="w-full text-left px-4 py-2 text-sm text-[#003366] hover:bg-[#E6ECF3] rounded-lg transition-colors"
        >
          未選択
        </button>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onToggle(option)}
            className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
              selected.includes(option)
                ? "bg-[#003366] text-white font-semibold"
                : "text-[#333333] hover:bg-[#E6ECF3]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* モバイル用オーバーレイ */}
      {isOpen && onClose && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* サイドバー本体 */}
      <aside
        className={`
          w-64 bg-white h-[calc(100vh-72px)] overflow-y-auto
          lg:sticky lg:top-[72px] lg:border-r lg:border-[#E6ECF3]
          fixed top-0 left-0 z-50 transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* モバイル用ヘッダー */}
        <div className="lg:hidden sticky top-0 bg-[#003366] text-white p-4 flex items-center justify-between z-10">
          <h2 className="font-bold text-lg">絞り込み条件</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:opacity-80"
          >
            ×
          </button>
        </div>

        <div className="p-4">
        {loading ? (
          <div className="text-center text-[#666666] py-8">読み込み中...</div>
        ) : filterOptions ? (
          <>
            <FilterSection
              title="エリア"
              icon="📍"
              options={filterOptions.regions.map((r) => r.name)}
              selected={selectedRegions}
              onToggle={onToggleRegion}
            />
            <FilterSection
              title="協賛タイプ"
              icon="💼"
              options={filterOptions.sponsorshipTypes.map((t) => t.value)}
              selected={selectedSponsorshipTypes}
              onToggle={onToggleSponsorshipType}
            />
            <FilterSection
              title="業種"
              icon="🏢"
              options={filterOptions.industries.map((i) => i.label)}
              selected={selectedIndustries}
              onToggle={onToggleIndustry}
            />
          </>
        ) : (
          <div className="text-center text-red-600 py-8">フィルタの読み込みに失敗しました</div>
        )}
      </div>
    </aside>
    </>
  );
}

