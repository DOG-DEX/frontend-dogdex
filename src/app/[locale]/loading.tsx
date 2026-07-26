"use client";

import Image from "next/image";

/**
 * Neo-Brutalist Game Boy System Loader
 * Streaming loading skeleton for DogDex App Router
 */
export default function Loading() {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center p-6 text-center">
      <div className="flex w-full max-w-md flex-col items-center rounded-3xl border-4 border-[#232B26] bg-white p-8 shadow-[10px_10px_0px_#232B26]">
        {/* Animated Beacon Icon Box */}
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-[#232B26] bg-[#39FF14] shadow-[4px_4px_0px_#232B26]">
          <Image
            src="/logos/logo-ic-black.png"
            alt="DogDex Scanner"
            width={44}
            height={44}
            className="animate-bounce object-contain"
          />
        </div>

        {/* Status Text */}
        <h2 className="font-sans text-xl font-black uppercase tracking-wider text-[#232B26] sm:text-2xl">
          LOADING DOGDEX...
        </h2>
        <p className="mt-1 font-mono text-xs font-bold text-[#404944]">
          Initializing pet database & radar services
        </p>

        {/* Retro Neo-Brutalist Progress Bar */}
        <div className="mt-6 flex h-4 w-full overflow-hidden rounded-full border-3 border-[#232B26] bg-[#F0EDE6] p-0.5 shadow-[2px_2px_0px_#232B26]">
          <div className="h-full w-full animate-pulse rounded-full bg-[#00A170]" />
        </div>
      </div>
    </div>
  );
}
