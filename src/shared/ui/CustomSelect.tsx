"use client";

import { useState, useRef, useEffect, useMemo } from "react";

export interface CustomSelectOption<T extends string = string> {
  value: T;
  label: string;
}

export interface CustomSelectProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: CustomSelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  enableSearch?: boolean;
  placement?: "top" | "bottom" | "auto";
}

export function CustomSelect<T extends string = string>({
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  disabled = false,
  className = "",
  buttonClassName = "",
  dropdownClassName = "",
  enableSearch = false,
  placement = "auto",
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDirection, setOpenDirection] = useState<"top" | "bottom">("bottom");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(() => {
    return options.find((o) => o.value === value);
  }, [options, value]);

  const filteredOptions = useMemo(() => {
    if (!enableSearch || !searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
    );
  }, [options, enableSearch, searchQuery]);

  // Calculate open direction (top vs bottom) based on viewport space
  useEffect(() => {
    if (isOpen && containerRef.current) {
      if (placement === "top") {
        setOpenDirection("top");
      } else if (placement === "bottom") {
        setOpenDirection("bottom");
      } else {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        // If less than 280px below and enough space above, open upwards
        if (spaceBelow < 280 && rect.top > 260) {
          setOpenDirection("top");
        } else {
          setOpenDirection("bottom");
        }
      }
    }
  }, [isOpen, placement]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      className={`relative w-full ${isOpen ? "z-50" : "z-10"} ${className}`}
      ref={containerRef}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-12 w-full items-center justify-between rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] px-4 font-mono text-sm font-bold text-[#232B26] shadow-[2px_2px_0px_#232B26] transition duration-200 hover:bg-white focus:bg-white focus:outline-none active:translate-x-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${buttonClassName}`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span
          className={`ml-2 transform font-mono text-xs font-black text-[#00A170] transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          v
        </span>
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 right-0 z-[9999] max-h-72 overflow-hidden rounded-2xl border-4 border-[#232B26] bg-white p-2 shadow-[8px_8px_0px_#232B26] transition-all duration-200 ease-out ${
            openDirection === "top" ? "bottom-full mb-2" : "top-full mt-2"
          } ${dropdownClassName}`}
        >
          {enableSearch && (
            <div className="mb-2 p-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                autoFocus
                className="w-full rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] px-3 py-1.5 font-mono text-xs font-bold text-[#232B26] focus:bg-white focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className="max-h-52 overflow-y-auto custom-scrollbar flex flex-col gap-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 font-mono text-xs font-bold transition text-left ${
                    opt.value === value
                      ? "bg-[#00A170] text-white shadow-sm"
                      : "text-[#232B26] hover:bg-[#FFD6A5]"
                  }`}
                >
                  <span>{opt.label}</span>
                  {opt.value === value && <span className="text-xs font-black">✓</span>}
                </button>
              ))
            ) : (
              <div className="p-3 text-center font-mono text-xs font-bold text-[#232B26]/60">
                Không tìm thấy kết quả
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
