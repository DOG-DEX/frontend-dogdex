import { Link } from "@/i18n/routing";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F0EDE6] p-4 sm:p-6 overflow-hidden">
      {/* Retro Back to Home Button in Top-Left Corner */}
      <div className="absolute top-4 left-4 z-50 sm:top-6 sm:left-6">
        <Link
          href="/"
          className="btn-brutal flex items-center gap-2 rounded-xl border-2 border-[#232B26] bg-white px-3.5 py-2 font-mono text-xs font-black uppercase tracking-wider text-[#232B26] shadow-[3px_3px_0px_#232B26] transition-all hover:bg-[#85E0C0] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0.5 active:translate-y-0.5"
        >
          <span>←</span>
          <span>Home</span>
        </Link>
      </div>

      {/* Main Centered Auth View */}
      <main className="flex w-full flex-1 items-center justify-center py-2">
        {children}
      </main>
    </div>
  );
}
