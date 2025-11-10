"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="企業名・キーワードで検索"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-6 py-4 text-base border border-[#E6ECF3] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent"
      />
    </div>
  );
}

