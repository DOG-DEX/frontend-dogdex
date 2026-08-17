"use client";

import { useState } from "react";
import Link from "next/link";

type PredictionHistoryItem = {
  id: string;
  breed: string;
  confidence: number;
  imageUrl: string;
  timestamp: string;
};

export function HistoryView() {
  const [historyItems] = useState<PredictionHistoryItem[]>([
    {
      id: "scan-1",
      breed: "Golden Retriever",
      confidence: 0.98,
      imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
      timestamp: "2026-08-15 14:30",
    },
    {
      id: "scan-2",
      breed: "Shiba Inu",
      confidence: 0.94,
      imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
      timestamp: "2026-08-14 09:15",
    },
    {
      id: "scan-3",
      breed: "Poodle",
      confidence: 0.91,
      imageUrl: "https://images.unsplash.com/photo-1591769225440-811ad7d6eca0?auto=format&fit=crop&w=800&q=80",
      timestamp: "2026-08-12 18:45",
    },
  ]);

  return (
    <div className="min-h-screen bg-[#F0EDE6] px-4 py-8 md:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 rounded-[2.5rem] border-4 border-[#232B26] bg-[#232B26] p-8 text-white shadow-[8px_8px_0px_#232B26]">
          <span className="font-mono text-xs font-black uppercase text-[#85E0C0]">
            AI VISION SCAN LOG
          </span>
          <h1 className="mt-1 text-3xl md:text-5xl font-black tracking-tight">
            LỊCH SỬ SOĨ AI
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Review all your past AI dog breed identification scans and confidence scores.
          </p>
        </header>

        {historyItems.length === 0 ? (
          <div className="rounded-3xl border-4 border-dashed border-[#232B26]/30 bg-white p-12 text-center">
            <span className="text-4xl">📸</span>
            <h3 className="mt-2 font-mono text-lg font-black text-[#232B26]">No Scans Recorded</h3>
            <p className="text-xs text-[#232B26]/70 mt-1">Upload a dog photo in AI Scan to start your history!</p>
            <Link
              href="/scan"
              className="mt-4 inline-block rounded-xl border-2 border-[#232B26] bg-[#85E0C0] px-5 py-2.5 font-mono text-xs font-black uppercase text-[#232B26]"
            >
              Start AI Scan
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-3xl border-4 border-[#232B26] bg-white p-4 shadow-[6px_6px_0px_#232B26]"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-[#232B26] bg-[#FFD6A5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.breed} className="h-full w-full object-cover" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <h3 className="text-lg font-black text-[#232B26]">{item.breed}</h3>
                  <span className="rounded-full border border-[#232B26] bg-[#85E0C0] px-2.5 py-0.5 font-mono text-xs font-black text-[#232B26]">
                    {(item.confidence * 100).toFixed(0)}% Match
                  </span>
                </div>

                <p className="mt-2 font-mono text-[10px] font-bold uppercase text-[#232B26]/50">
                  Scanned: {item.timestamp}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
