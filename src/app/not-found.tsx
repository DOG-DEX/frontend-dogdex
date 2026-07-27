import Image from "next/image";
import Link from "next/link";

/**
 * Root fallback 404 page for non-localized route exceptions.
 * This must not render html/body because locale layouts already own the shell.
 */
export default function GlobalNotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#F0EDE6] p-6 text-center text-[#232B26]">
      <div className="flex w-full max-w-md flex-col items-center rounded-3xl border-4 border-[#232B26] bg-[#FFFBEA] p-6 shadow-[10px_10px_0px_#232B26] sm:p-8">
        <div className="mb-4 rounded-xl border-4 border-[#232B26] bg-[#FF3B30] px-4 py-1.5 shadow-[3px_3px_0px_#232B26]">
          <span className="font-sans text-xl font-black uppercase tracking-widest text-white sm:text-2xl">
            404 PAGE LOST!
          </span>
        </div>

        <div className="relative mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border-4 border-[#232B26] bg-white p-2 shadow-[4px_4px_0px_#232B26]">
          <Image
            src="/logos/logo-ic-black.png"
            alt="Missing Page Dog"
            width={80}
            height={80}
            className="object-contain opacity-40 grayscale"
          />
          <div className="absolute inset-0 flex items-center justify-center font-sans text-4xl font-black text-[#FF3B30]">
            ?
          </div>
        </div>

        <h2 className="font-sans text-xl font-black uppercase tracking-tight text-[#232B26]">
          ROAMED OFF THE MAP!
        </h2>
        <p className="mt-1 font-mono text-xs font-bold text-[#404944] sm:text-sm">
          The page or route you requested could not be located in our DogDex
          system.
        </p>

        <div className="mt-6 w-full">
          <Link
            href="/"
            className="btn-brutal block w-full rounded-xl border-4 border-[#232B26] bg-[#00A170] py-3 text-center text-sm font-extrabold text-white shadow-[4px_4px_0px_#232B26] transition-all hover:bg-[#008f63] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#232B26]"
          >
            RETURN TO HEADQUARTERS
          </Link>
        </div>
      </div>
    </div>
  );
}
