"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/routing";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Neo-Brutalist 500 System Error Screen
 * Handles unexpected runtime exceptions with retro cartridge fault aesthetics
 */
export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Unhandled runtime error captured in error.tsx:", error);
  }, [error]);

  return (
    <div className="flex min-h-[75vh] w-full flex-col items-center justify-center p-6 text-center">
      <div className="flex w-full max-w-lg flex-col items-center overflow-hidden rounded-3xl border-4 border-[#232B26] bg-white shadow-[10px_10px_0px_#232B26]">
        {/* Error Header Banner */}
        <div className="flex w-full items-center justify-between border-b-4 border-[#232B26] bg-[#FF3B30] px-6 py-3 text-white">
          <span className="font-sans text-sm font-black uppercase tracking-widest">
            CARTRIDGE FAULT (500)
          </span>
          <span className="font-mono text-xs font-bold border-2 border-white px-2 py-0.5">
            CRITICAL
          </span>
        </div>

        {/* Error Body */}
        <div className="flex flex-col items-center p-6 sm:p-8">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-[#232B26] bg-[#FF3B30] text-2xl font-black text-white shadow-[4px_4px_0px_#232B26]">
            ⚠️
          </div>

          <h1 className="font-sans text-2xl font-black uppercase tracking-tight text-[#232B26] sm:text-3xl">
            SYSTEM GLITCH DETECTED
          </h1>
          <p className="mt-2 max-w-md font-mono text-xs font-bold text-[#404944] sm:text-sm">
            DogDex encountered an unexpected system exception while loading this module.
          </p>

          {/* Dev Exception Output Box */}
          {error?.message && (
            <div className="mt-4 w-full rounded-xl border-2 border-[#232B26] bg-[#1A1C1B] p-3 text-left font-mono text-xs text-[#FF3B30] shadow-[2px_2px_0px_#232B26] break-all max-h-32 overflow-y-auto">
              <span className="block font-bold text-zinc-400 mb-1">[SYS_ERROR_TRACE]:</span>
              {error.message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => reset()}
              className="btn-brutal flex-1 rounded-xl border-4 border-[#232B26] bg-[#00A170] py-3 text-center text-sm font-extrabold text-white shadow-[4px_4px_0px_#232B26] transition-all hover:bg-[#008f63] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#232B26]"
            >
              REBOOT SYSTEM →
            </button>
            <Link
              href="/"
              className="btn-brutal flex-1 rounded-xl border-4 border-[#232B26] bg-white py-3 text-center text-sm font-extrabold text-[#232B26] shadow-[4px_4px_0px_#232B26] transition-all hover:bg-zinc-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#232B26]"
            >
              HEADQUARTERS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
