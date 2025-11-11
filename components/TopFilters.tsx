"use client";

import {
  industryOptions,
  sponsorshipTypeOptions,
  regionOptions,
} from "@/lib/mockData";
import { useMemo, useState } from "react";

interface TopFiltersProps {
  selectedIndustries: string[];
  selectedSponsorshipTypes: string[];
  selectedRegions: string[];
  onToggleIndustry: (value: string) => void;
  onToggleSponsorshipType: (value: string) => void;
  onToggleRegion: (value: string) => void;
}

type FilterKey = "industry" | "sponsorship" | "region";

const iconColumnClass =
  "w-20 sm:w-24 bg-[#003366] text-white flex flex-col items-center justify-center py-4 space-y-1";

export default function TopFilters({
  selectedIndustries,
  selectedSponsorshipTypes,
  selectedRegions,
  onToggleIndustry,
  onToggleSponsorshipType,
  onToggleRegion,
}: TopFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey | null>(null);

  const filters = useMemo(
    () => [
      {
        key: "region" as FilterKey,
        title: "エリア",
        icon: "📍",
        options: regionOptions,
        selected: selectedRegions,
        toggle: onToggleRegion,
      },
      {
        key: "sponsorship" as FilterKey,
        title: "協賛タイプ",
        icon: "🤝",
        options: sponsorshipTypeOptions,
        selected: selectedSponsorshipTypes,
        toggle: onToggleSponsorshipType,
      },
      {
        key: "industry" as FilterKey,
        title: "業種",
        icon: "🏢",
        options: industryOptions,
        selected: selectedIndustries,
        toggle: onToggleIndustry,
      },
    ],
    [
      selectedIndustries,
      selectedSponsorshipTypes,
      selectedRegions,
      onToggleIndustry,
      onToggleSponsorshipType,
      onToggleRegion,
    ]
  );

  const activeFilterData = activeFilter
    ? filters.find((filter) => filter.key === activeFilter)
    : null;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
        <div className="divide-y divide-slate-200">
          {filters.map((filter) => {
            const selectedLabel =
              filter.selected.length > 0
                ? filter.selected.slice(0, 3).join(" / ") +
                  (filter.selected.length > 3
                    ? ` 他${filter.selected.length - 3}件`
                    : "")
                : "未選択";

            return (
              <div key={filter.key} className="bg-white">
                <button
                  onClick={() => setActiveFilter(filter.key)}
                  className="w-full flex items-stretch group"
                >
                  <div className={iconColumnClass}>
                    <span className="text-2xl">{filter.icon}</span>
                    <span className="text-xs sm:text-sm font-semibold tracking-wide">
                      {filter.title}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-between px-4 sm:px-6 py-4">
                    <div className="text-left">
                      <p className="text-sm text-[#1F2A44] font-semibold">
                        {selectedLabel}
                      </p>
                      <p className="text-xs text-[#6B7A93] mt-1">
                        タップして条件を選択
                      </p>
                    </div>
                    <span className="text-[#003366] text-sm font-semibold flex items-center gap-1">
                      選択
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        fill="none"
                      >
                        <path
                          d="M9 5l7 7-7 7"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {activeFilterData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setActiveFilter(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 sm:mx-0 p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-[#003366]">
                  {activeFilterData.title}を選択
                </h3>
                <p className="text-sm text-[#6B7A93] mt-1">
                  該当する条件をタップして選択・解除できます。
                </p>
              </div>
              <button
                onClick={() => setActiveFilter(null)}
                className="text-[#003366] hover:text-[#00294f]"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>

            <div className="max-h-[320px] overflow-y-auto pr-1">
              <div className="flex flex-wrap gap-2">
                {activeFilterData.options.map((option) => {
                  const isSelected = activeFilterData.selected.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => activeFilterData.toggle(option)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                        isSelected
                          ? "bg-[#003366] text-white font-semibold shadow-sm"
                          : "bg-white text-[#1F2A44] border border-slate-200 hover:bg-[#003366]/10"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between text-xs text-[#6B7A93]">
              <span>選択済み：{activeFilterData.selected.length}件</span>
              <button
                onClick={() => setActiveFilter(null)}
                className="text-sm text-[#003366] font-semibold hover:underline"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

