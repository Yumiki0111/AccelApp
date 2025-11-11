"use client";

import { industryOptions, sponsorshipTypeOptions, regionOptions } from "@/lib/mockData";

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
        <FilterSection
          title="エリア"
          icon="📍"
          options={regionOptions}
          selected={selectedRegions}
          onToggle={onToggleRegion}
        />
        <FilterSection
          title="職種"
          icon="💼"
          options={sponsorshipTypeOptions}
          selected={selectedSponsorshipTypes}
          onToggle={onToggleSponsorshipType}
        />
        <FilterSection
          title="業種"
          icon="🏢"
          options={industryOptions}
          selected={selectedIndustries}
          onToggle={onToggleIndustry}
        />
      </div>
    </aside>
    </>
  );
}

