"use client";

interface MobileFilterButtonProps {
  onClick: () => void;
  filterCount: number;
}

export default function MobileFilterButton({ onClick, filterCount }: MobileFilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed bottom-6 right-6 z-40 bg-[#003366] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-[#00294f] transition-colors"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
        />
      </svg>
      <span className="font-semibold">絞り込み</span>
      {filterCount > 0 && (
        <span className="bg-white text-[#003366] px-2 py-0.5 rounded-full text-xs font-bold">
          {filterCount}
        </span>
      )}
    </button>
  );
}

