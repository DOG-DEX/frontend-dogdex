"use client";

export default function TestErrorPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-black">Error Testing Route</h1>
      <button
        type="button"
        onClick={() => {
          throw new Error("Simulated Cartridge Fault: Test 500 Exception Triggered!");
        }}
        className="rounded-xl border-4 border-[#232B26] bg-[#FF3B30] px-6 py-3 font-extrabold text-white shadow-[4px_4px_0px_#232B26]"
      >
        TRIGGER SIMULATED 500 ERROR
      </button>
    </div>
  );
}
