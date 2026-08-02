"use client";

import React from "react";

export interface StatBarProps {
  label: string;
  value: number; // 1 to 5
  max?: number;
  icon?: React.ReactNode;
  activeColor?: string; // e.g. '#F87171', '#FACC15', '#60A5FA'
  inactiveColor?: string;
  className?: string;
}

export function StatBar({
  label,
  value,
  max = 5,
  icon,
  activeColor = "#F87171",
  inactiveColor = "#DCE5DD",
  className = "",
}: StatBarProps) {
  const normalizedValue = Math.max(0, Math.min(max, Math.round(value)));

  return (
    <div className={`flex w-full items-center gap-3 ${className}`}>
      {/* Label and Icon */}
      <div className="flex w-28 shrink-0 items-center gap-1.5 font-mono text-xs font-black uppercase text-[#232B26]">
        {icon && <span className="flex shrink-0 items-center">{icon}</span>}
        <span className="truncate tracking-wider">{label}</span>
      </div>

      {/* 5-Block Segmented Bar */}
      <div className="flex flex-1 items-center gap-1.5">
        {Array.from({ length: max }).map((_, index) => {
          const isActive = index < normalizedValue;
          return (
            <div
              key={index}
              className="h-4 flex-1 rounded-sm border-2 border-[#232B26] transition-colors duration-200"
              style={{
                backgroundColor: isActive ? activeColor : inactiveColor,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
