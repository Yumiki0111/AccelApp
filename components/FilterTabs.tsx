"use client";

interface FilterTabsProps {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}

export default function FilterTabs({ title, options, selected, onToggle }: FilterTabsProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-[#666666]">{title}</h3>
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              onClick={() => onToggle(option)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-[#003366] text-white shadow-md"
                  : "bg-[#E6ECF3] text-[#003366] hover:bg-[#003366] hover:text-white"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

