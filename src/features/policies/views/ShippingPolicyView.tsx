"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";

/**
 * ShippingPolicyView Component
 * Dedicated View for Shipping Policy (Chính sách vận chuyển & giao hàng)
 * Architecture: src/features/policies/views/ShippingPolicyView.tsx
 * Design Vibe: Neo-Brutalist Pop (#F0EDE6 bg, #00A170 teal accents, #232B26 borders)
 * NO ICON LIBRARIES USED.
 */
export function ShippingPolicyView() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopyLink = (sectionId: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/policies/shipping#${sectionId}`;
      navigator.clipboard.writeText(url);
      setCopiedSection(sectionId);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  return (
    <section className="min-h-screen bg-[#F0EDE6] px-4 py-8 md:px-10 md:py-14 text-[#232B26]">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#232B26]/80">
            <Link href="/policies" className="hover:underline hover:text-[#00A170]">
              POLICIES HUB
            </Link>
            <span>/</span>
            <span className="rounded-md border border-[#232B26] bg-[#00A170] px-2 py-0.5 text-white">
              SHIPPING POLICY
            </span>
          </div>
          <Link
            href="/policies"
            className="btn-brutal rounded-xl bg-white px-4 py-2 font-mono text-xs font-black uppercase shadow-[3px_3px_0px_#232B26] transition hover:bg-[#85E0C0]"
          >
            ← Tất Cả Chính Sách
          </Link>
        </div>

        {/* Hero Header Card */}
        <header className="relative overflow-hidden rounded-[2.5rem] border-4 border-[#232B26] bg-[#00A170] p-8 text-white shadow-[10px_10px_0px_#232B26] md:p-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-[#232B26] bg-white px-4 py-1 font-mono text-xs font-black uppercase text-[#232B26]">
            <span>EXPRESS LOGISTICS</span>
            <span>•</span>
            <span>NATIONWIDE DELIVERY</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl md:text-5xl">
            Chính Sách Vận Chuyển & Giao Hàng
          </h1>
          <p className="mt-3 max-w-2xl font-sans text-base font-bold text-white/90 md:text-lg">
            Quy trình xử lý đóng gói đơn hàng vòng cổ chó chuyên nghiệp từ 1-2 ngày và giao vận toàn quốc từ 2-5 ngày làm việc.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 text-[#232B26]">
            <div className="rounded-2xl border-2 border-[#232B26] bg-white p-4 shadow-[3px_3px_0px_#232B26]">
              <div className="font-mono text-xs font-black uppercase text-[#232B26]/70">XỬ LÝ ĐƠN HÀNG</div>
              <div className="font-black text-sm mt-1">Từ 1 - 2 ngày làm việc</div>
            </div>
            <div className="rounded-2xl border-2 border-[#232B26] bg-white p-4 shadow-[3px_3px_0px_#232B26]">
              <div className="font-mono text-xs font-black uppercase text-[#232B26]/70">NỘI THÀNH (TP.HCM/HN)</div>
              <div className="font-black text-sm mt-1">Nhanh chóng 1 - 2 ngày</div>
            </div>
            <div className="rounded-2xl border-2 border-[#232B26] bg-white p-4 shadow-[3px_3px_0px_#232B26]">
              <div className="font-mono text-xs font-black uppercase text-[#232B26]/70">GIAO TOÀN QUỐC</div>
              <div className="font-black text-sm mt-1">Từ 2 - 5 ngày làm việc</div>
            </div>
          </div>
        </header>

        {/* Detailed Sections */}
        <main className="space-y-8">
          {/* SECTION 1 */}
          <article id="sec-processing-time" className="rounded-[2rem] border-4 border-[#232B26] bg-white p-6 shadow-[8px_8px_0px_#232B26] md:p-8">
            <div className="mb-4 flex items-center justify-between border-b-2 border-[#232B26] pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#232B26] bg-[#00A170] font-mono text-sm font-black text-white">
                  01
                </span>
                <h2 className="text-xl font-black uppercase text-[#232B26] sm:text-2xl">
                  Thời Gian Xử Lý Đơn Hàng (Order Processing Time)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => handleCopyLink("sec-processing-time")}
                className="font-mono text-xs font-bold uppercase underline text-[#232B26]/70 hover:text-[#00A170]"
              >
                {copiedSection === "sec-processing-time" ? "[COPIED!]" : "[COPY LINK]"}
              </button>
            </div>

            <div className="space-y-4 font-sans text-base leading-relaxed text-[#232B26]/90">
              <p>
                Sau khi quý khách hoàn tất thao tác đặt hàng vòng cổ chó trên website, bộ phận kho vận của Pet Care Dog Dex tiến hành xác minh thông số size và đóng gói trong vòng <strong>1 đến 2 ngày làm việc</strong> (không tính Chủ Nhật và các ngày nghỉ lễ).
              </p>

              <div className="rounded-2xl border-2 border-[#232B26] bg-[#F0EDE6] p-5 space-y-2">
                <div className="font-mono text-xs font-black uppercase text-[#00A170]">QUY TRÌNH 4 BƯỚC ĐÓNG GÓI CHUYÊN NGHIỆP:</div>
                <ol className="list-decimal pl-6 space-y-1 font-medium text-sm text-[#232B26]">
                  <li>Kiểm tra bề mặt da/vải nylon vòng cổ chó & độ bền của chốt gài kim loại.</li>
                  <li>Dán thẻ thông số size & niêm phong màng co chống ẩm.</li>
                  <li>Bọc chống sốc màng bong bóng và dán nhãn thông tin giao hàng chính xác.</li>
                  <li>Bàn giao cho đơn vị vận chuyển đối tác (GHTK, GHN, Viettel Post...).</li>
                </ol>
              </div>
            </div>
          </article>

          {/* SECTION 2 */}
          <article id="sec-[#delivery-time]" className="rounded-[2rem] border-4 border-[#232B26] bg-white p-6 shadow-[8px_8px_0px_#232B26] md:p-8">
            <div className="mb-4 flex items-center justify-between border-b-2 border-[#232B26] pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#232B26] bg-[#FFD6A5] font-mono text-sm font-black text-[#232B26]">
                  02
                </span>
                <h2 className="text-xl font-black uppercase text-[#232B26] sm:text-2xl">
                  Thời Gian Giao Hàng Nội Địa Toàn Quốc
                </h2>
              </div>
              <button
                type="button"
                onClick={() => handleCopyLink("delivery-time")}
                className="font-mono text-xs font-bold uppercase underline text-[#232B26]/70 hover:text-[#00A170]"
              >
                {copiedSection === "delivery-time" ? "[COPIED!]" : "[COPY LINK]"}
              </button>
            </div>

            <div className="space-y-4 font-sans text-base leading-relaxed text-[#232B26]/90">
              <p>
                Thời gian bưu tá giao vòng cổ chó đến tận nhà khách hàng dao động từ <strong>2 đến 5 ngày làm việc</strong> phụ thuộc vào vị trí địa lý:
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                <div className="rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] p-6 shadow-[4px_4px_0px_#232B26]">
                  <div className="mb-2 inline-block rounded-md border border-[#232B26] bg-[#00A170] px-2.5 py-0.5 font-mono text-xs font-black uppercase text-white">
                    REGION 01 / METRO
                  </div>
                  <h3 className="text-lg font-black uppercase text-[#232B26]">Khu Vực Nội Thành (TP.HCM & Hà Nội)</h3>
                  <p className="text-sm font-bold text-[#00A170] mt-1">Từ 1 - 2 ngày làm việc</p>
                  <p className="text-xs text-[#232B26]/80 mt-2">Hỗ trợ giao hàng hỏa tốc trong ngày qua đối tác AhaMove khi khách hàng yêu cầu gấp.</p>
                </div>

                <div className="rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] p-6 shadow-[4px_4px_0px_#232B26]">
                  <div className="mb-2 inline-block rounded-md border border-[#232B26] bg-[#FF6B00] px-2.5 py-0.5 font-mono text-xs font-black uppercase text-white">
                    REGION 02 / PROVINCES
                  </div>
                  <h3 className="text-lg font-black uppercase text-[#232B26]">Các Tỉnh Thành Khác</h3>
                  <p className="text-sm font-bold text-[#FF6B00] mt-1">Từ 2 - 5 ngày làm việc</p>
                  <p className="text-xs text-[#232B26]/80 mt-2">Phát hàng tiêu chuẩn chuyển phát nhanh thông qua GHTK, GHN và Bưu điện Viettel Post.</p>
                </div>
              </div>
            </div>
          </article>
        </main>

        {/* Footer Jump Bar */}
        <footer className="rounded-2xl border-4 border-[#232B26] bg-[#85E0C0] p-6 shadow-[6px_6px_0px_#232B26]">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <div className="font-mono text-xs font-black uppercase text-[#232B26]">CÁC CHÍNH SÁCH KHÁC</div>
              <div className="text-sm font-bold text-[#232B26]">Khám phá thêm bảo mật và điều khoản sử dụng</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/policies/privacy"
                className="rounded-xl border-2 border-[#232B26] bg-white px-4 py-2 text-xs font-bold text-[#232B26] hover:bg-[#FFD6A5]"
              >
                Chính Sách Bảo Mật →
              </Link>
              <Link
                href="/policies/terms"
                className="rounded-xl border-2 border-[#232B26] bg-white px-4 py-2 text-xs font-bold text-[#232B26] hover:bg-[#85E0C0]"
              >
                Điều Khoản Sử Dụng →
              </Link>
              <Link
                href="/policies/refund"
                className="rounded-xl border-2 border-[#232B26] bg-white px-4 py-2 text-xs font-bold text-[#232B26] hover:bg-[#FF3B30] hover:text-white"
              >
                Chính Sách Đổi Trả →
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
