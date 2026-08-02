"use client";

import { CustomSelect, CustomSelectOption } from "@/shared/ui/CustomSelect";

export type FilterStatus = "ALL" | "COLLECTED" | "MISSING" | "LEGENDARY";
export type SortOption = "NUMBER" | "NAME" | "GROUP";

interface BreedFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: FilterStatus;
  onStatusFilterChange: (status: FilterStatus) => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  totalCount: number;
}

const SORT_OPTIONS: CustomSelectOption<SortOption>[] = [
  { value: "NUMBER", label: "NUMBER" },
  { value: "NAME", label: "NAME" },
  { value: "GROUP", label: "GROUP" },
];

export function BreedFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  totalCount,
}: BreedFilterBarProps) {
  const statusChips: { id: FilterStatus; label: string; activeClass: string; inactiveClass: string }[] = [
    {
      id: "ALL",
      label: `ALL (${totalCount})`,
      activeClass: "bg-[#232B26] text-white",
      inactiveClass: "bg-[#E2EAE2] text-[#5A4136] hover:bg-white",
    },
    {
      id: "COLLECTED",
      label: "COLLECTED",
      activeClass: "bg-[#006C4A] text-white",
      inactiveClass: "bg-[#E2EAE2] text-[#5A4136] hover:bg-white",
    },
    {
      id: "MISSING",
      label: "MISSING",
      activeClass: "bg-[#5A4136] text-white",
      inactiveClass: "bg-[#E2EAE2] text-[#5A4136] hover:bg-white",
    },
    {
      id: "LEGENDARY",
      label: "LEGENDARY",
      activeClass: "bg-[#FF6B00] text-white",
      inactiveClass: "bg-[#FFDBCC] text-[#351000] hover:bg-[#FFC9B3]",
    },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border-4 border-[#232B26] bg-[#F3FCF3] p-5 shadow-[6px_6px_0px_#232B26]">
      {/* Search Input Row */}
      <div className="relative w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="SEARCH BREED OR SLUG..."
          className="h-12 w-full rounded-xl border-4 border-[#232B26] bg-white pl-12 pr-4 font-mono text-sm font-bold text-[#232B26] uppercase placeholder:text-[#5A4136]/50 shadow-[4px_4px_0px_#232B26] focus:bg-white focus:outline-none"
        />
        <svg
          className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 fill-[#232B26]"
          viewBox="0 0 18 18"
        >
          <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z" />
        </svg>
      </div>

      {/* Filter Chips & Sort Select */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Status Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {statusChips.map((chip) => {
            const isActive = statusFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => onStatusFilterChange(chip.id)}
                className={`rounded-xl border-4 border-[#232B26] px-3.5 py-1.5 font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_#232B26] transition active:translate-x-0.5 active:translate-y-0.5 ${
                  isActive ? chip.activeClass : chip.inactiveClass
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-black uppercase text-[#232B26]">
            SORT BY:
          </span>
          <div className="w-36">
            <CustomSelect
              value={sortBy}
              onChange={onSortByChange}
              options={SORT_OPTIONS}
              buttonClassName="h-9 rounded-xl border-4 text-xs shadow-[2px_2px_0px_#232B26] bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
