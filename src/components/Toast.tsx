"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  badge?: string;
  duration?: number;
  details?: string; // Technical details for Dev Mode
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

/**
 * Compact Neo-Brutalist Toast Component
 * Features expandable Dev Mode technical details log drawer & auto-dismiss progress.
 */
export function Toast({ toast, onClose }: ToastProps) {
  const duration = toast.duration ?? 3500;
  const [progress, setProgress] = useState(100);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // If user expanded Dev Mode details, pause auto-dismiss so they can read logs
    if (showDetails) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onClose(toast.id);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [toast.id, duration, onClose, showDetails]);

  // Color mappings based on ToastType
  const typeStyles = {
    success: {
      headerBg: "bg-[#39FF14]",
      headerText: "text-[#232B26]",
      iconBg: "bg-[#39FF14]",
      closeBg: "bg-[#FF3B30]",
      closeText: "text-white",
      progressBg: "bg-[#39FF14]",
      badgeText: toast.badge || "NOW",
    },
    error: {
      headerBg: "bg-[#FF3B30]",
      headerText: "text-white",
      iconBg: "bg-[#FF3B30]",
      closeBg: "bg-white",
      closeText: "text-[#232B26]",
      progressBg: "bg-[#FF3B30]",
      badgeText: toast.badge || "NOW",
    },
    info: {
      headerBg: "bg-[#FFD6A5]",
      headerText: "text-[#232B26]",
      iconBg: "bg-[#FFD6A5]",
      closeBg: "bg-[#00A170]",
      closeText: "text-white",
      progressBg: "bg-[#FFD6A5]",
      badgeText: toast.badge || "1m ago",
    },
  }[toast.type];

  return (
    <div className="relative flex w-full max-w-[340px] flex-col overflow-hidden rounded-xl border-[3px] border-[#232B26] bg-[#F4F5F0] shadow-[5px_5px_0px_#232B26] animate-in fade-in slide-in-from-top-3 duration-200">
      {/* Compact Toast Header */}
      <div
        className={`flex items-center justify-between border-b-[3px] border-[#232B26] px-2.5 py-1.5 ${typeStyles.headerBg}`}
      >
        <div className="text-xs font-black uppercase tracking-[2px] font-sans">
          <span className={typeStyles.headerText}>{toast.type}</span>
        </div>
        <div className="flex items-center border-[2px] border-[#232B26] bg-white px-1.5 py-0.5 shadow-xs">
          <span className="font-mono text-[10px] font-black tracking-wider text-[#232B26]">
            {typeStyles.badgeText}
          </span>
        </div>
      </div>

      {/* Compact Toast Body */}
      <div className="flex items-start gap-3 p-3">
        {/* Type Icon Box */}
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center border-[3px] border-[#232B26] ${typeStyles.iconBg}`}
        >
          {toast.type === "success" && (
            <svg width="18" height="18" viewBox="0 0 22 21" fill="none">
              <path
                d="M2.675 9.7C1.926 9.7 1.29292 9.4375 0.77575 8.9125C0.258583 8.3875 0 7.75 0 7C0 6.25 0.258685 5.6125 0.776056 5.0875C1.29343 4.5625 1.92676 4.3 2.67606 4.3C3.42535 4.3 4.0625 4.5625 4.5875 5.0875C5.1125 5.6125 5.375 6.25 5.375 7C5.375 7.75 5.114 8.3875 4.592 8.9125C4.07 9.4375 3.431 9.7 2.675 9.7V9.7M7.60106 5.375C6.85176 5.375 6.21843 5.11631 5.70106 4.59894C5.18369 4.08157 4.925 3.44824 4.925 2.69894C4.925 1.94965 5.18369 1.3125 5.70106 0.7875C6.21843 0.2625 6.85176 0 7.60106 0C8.35035 0 8.9875 0.261 9.5125 0.783C10.0375 1.305 10.3 1.944 10.3 2.7C10.3 3.449 10.0375 4.08208 9.5125 4.59925C8.9875 5.11642 8.35035 5.375 7.60106 5.375V5.375M14.1489 5.375C13.3996 5.375 12.7625 5.11631 12.2375 4.59894C11.7125 4.08157 11.45 3.44824 11.45 2.69894C11.45 1.94965 11.711 1.3125 12.233 0.7875C12.755 0.2625 13.394 0 14.15 0C14.899 0 15.5321 0.2625 16.0492 0.7875C16.5664 1.3125 16.825 1.94965 16.825 2.69894C16.825 3.44824 16.5663 4.08157 16.0489 4.59894C15.5316 5.11631 14.8982 5.375 14.1489 5.375V5.375M19.0739 9.7C18.3246 9.7 17.6875 9.4375 17.1625 8.9125C16.6375 8.3875 16.375 7.75 16.375 7C16.375 6.25 16.636 5.6125 17.158 5.0875C17.68 4.5625 18.319 4.3 19.075 4.3C19.824 4.3 20.4571 4.5625 20.9742 5.0875C21.4914 5.6125 21.75 6.25 21.75 7C21.75 7.75 21.4913 8.3875 20.9739 8.9125C20.4566 9.4375 19.8232 9.7 19.0739 9.7V9.7M5.3 20.6C4.45 20.6 3.74583 20.2833 3.1875 19.65C2.62917 19.0167 2.35 18.2583 2.35 17.375C2.35 16.4417 2.67083 15.6375 3.3125 14.9625C3.95417 14.2875 4.56667 13.6 5.15 12.9C5.61667 12.3167 6.04167 11.7167 6.425 11.1C6.80833 10.4833 7.25 9.9 7.75 9.35C8.14875 8.87333 8.61094 8.47917 9.13656 8.1675C9.66219 7.85583 10.2417 7.7 10.875 7.7C11.5083 7.7 12.0875 7.85 12.6125 8.15C13.1375 8.45 13.6083 8.83333 14.025 9.3C14.5114 9.85346 14.9413 10.4502 15.3148 11.0901C15.6883 11.73 16.1167 12.3333 16.6 12.9C17.1833 13.6 17.7958 14.2875 18.4375 14.9625C19.0792 15.6375 19.4 16.4417 19.4 17.375C19.4 18.2583 19.1208 19.0167 18.5625 19.65C18.0042 20.2833 17.3 20.6 16.45 20.6C15.5 20.6 14.5708 20.5208 13.6625 20.3625C12.7542 20.2042 11.825 20.125 10.875 20.125C9.925 20.125 8.99583 20.2042 8.0875 20.3625C7.17917 20.5208 6.25 20.6 5.3 20.6V20.6"
                fill="#232B26"
              />
            </svg>
          )}

          {toast.type === "error" && (
            <svg width="18" height="18" viewBox="0 0 21 12" fill="none">
              <path
                d="M0 11.425V0H3.15V4.125H5.7V0H8.85V11.425H5.7V7.275H3.15V11.425H0V11.425M15.55 11.425V8.275H10.85V0H14V5.125H15.55V0H18.7V5.125H20.7V8.275H18.7V11.425H15.55V11.425"
                fill="white"
              />
            </svg>
          )}

          {toast.type === "info" && (
            <svg width="14" height="18" viewBox="0 0 11 13" fill="none">
              <path
                d="M5.1625 6.475C5.53194 6.475 5.84306 6.34861 6.09583 6.09583C6.34861 5.84306 6.475 5.53194 6.475 5.1625C6.475 4.79306 6.34861 4.48194 6.09583 4.22917C5.84306 3.97639 5.53194 3.85 5.1625 3.85C4.79306 3.85 4.48194 3.97639 4.22917 4.22917C3.97639 4.48194 3.85 4.79306 3.85 5.1625C3.85 5.53194 3.97639 5.84306 4.22917 6.09583C4.48194 6.34861 4.79306 6.475 5.1625 6.475V6.475M5.1625 12.6583C3.44167 11.2292 2.15104 9.93125 1.29062 8.76458C0.430208 7.59792 0 6.41667 0 5.22083C0 3.62639 0.520139 2.35764 1.56042 1.41458C2.60069 0.471528 3.80139 0 5.1625 0C6.52361 0 7.72431 0.471528 8.76458 1.41458C9.80486 2.35764 10.325 3.62639 10.325 5.22083C10.325 6.41667 9.89479 7.59792 9.03438 8.76458C8.17396 9.93125 6.88333 11.2292 5.1625 12.6583V12.6583"
                fill="#232B26"
              />
            </svg>
          )}
        </div>

        {/* Title & Description Container */}
        <div className="flex flex-1 flex-col gap-0.5 pr-1">
          <div className="font-sans text-xs font-black uppercase tracking-wider text-[#232B26] leading-tight">
            {toast.title}
          </div>
          <div className="font-mono text-[11px] font-bold text-[#404944] leading-snug">
            {toast.message}
          </div>

          {/* Underlined Dev Mode Details Link */}
          {toast.details && (
            <button
              type="button"
              onClick={() => setShowDetails((prev) => !prev)}
              className="mt-1 text-left font-mono text-[10px] font-bold text-[#00A170] underline underline-offset-2 hover:text-[#008f63] cursor-pointer"
            >
              {showDetails ? "▼ Hide dev details" : "▶ View dev details"}
            </button>
          )}
        </div>

        {/* Compact Close Button */}
        <button
          type="button"
          onClick={() => onClose(toast.id)}
          className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 border-[#232B26] shadow-[1px_1px_0px_#232B26] transition-transform active:scale-95 ${typeStyles.closeBg}`}
          aria-label="Close notification"
        >
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path
              d="M1.28333 9.1L0 7.81667L3.26667 4.55L0 1.28333L1.28333 0L4.55 3.26667L7.81667 0L9.1 1.28333L5.83333 4.55L9.1 7.81667L7.81667 9.1L4.55 5.83333L1.28333 9.1V9.1"
              className={typeStyles.closeText}
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      {/* Expandable Dev Mode Technical Log Drawer */}
      {showDetails && toast.details && (
        <div className="border-t-2 border-[#232B26] bg-[#1A1C1B] p-2 font-mono text-[10px] text-[#39FF14] leading-relaxed max-h-28 overflow-y-auto break-all">
          <div className="mb-1 font-bold uppercase tracking-wider text-zinc-400">
            [DEV_LOG_TRACE]
          </div>
          <pre className="whitespace-pre-wrap">{toast.details}</pre>
        </div>
      )}

      {/* Compact Progress Bar */}
      <div className="relative h-2 w-full border-t-[3px] border-[#232B26] bg-[#232B26]">
        <div
          className={`h-full transition-all duration-75 ${typeStyles.progressBg}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
