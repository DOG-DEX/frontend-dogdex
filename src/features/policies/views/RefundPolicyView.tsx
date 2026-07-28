"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";

/**
 * RefundPolicyView Component
 * Dedicated View for Return & Refund Policy (Chính sách đổi trả & hoàn tiền)
 * Architecture: src/features/policies/views/RefundPolicyView.tsx
 * Design Vibe: Neo-Brutalist Pop (#F0EDE6 bg, #FF3B30 red accents, #232B26 borders)
 * NO ICON LIBRARIES USED.
 */
export function RefundPolicyView() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopyLink = (sectionId: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/policies/refund#${sectionId}`;
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
            <span className="rounded-md border border-[#232B26] bg-[#FF3B30] px-2 py-0.5 text-white">
              RETURN & REFUND
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
        <header className="relative overflow-hidden rounded-[2.5rem] border-4 border-[#232B26] bg-[#FF3B30] p-8 text-white shadow-[10px_10px_0px_#232B26] md:p-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-[#232B26] bg-white px-4 py-1 font-mono text-xs font-black uppercase text-[#232B26]">
            <span>GUARANTEE 7 DAYS</span>
            <span>•</span>
            <span>DOG COLLAR EXCHANGE</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl md:text-5xl">
            Chính Sách Đổi Trả & Hoàn Tiền
          </h1>
          <p className="mt-3 max-w-2xl font-sans text-base font-bold text-white/90 md:text-lg">
            Hỗ trợ đổi mới vòng cổ chó trong 07 ngày đối với các lỗi sai kích thước (size) hoặc lỗi sản xuất từ nhà máy.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 text-[#232B26]">
            <div className="rounded-2xl border-2 border-[#232B26] bg-white p-4 shadow-[3px_3px_0px_#232B26]">
              <div className="font-mono text-xs font-black uppercase text-[#232B26]/70">THỜI HẠN ĐỔI TRẢ</div>
              <div className="font-black text-sm mt-1">Trong vòng 07 ngày nhận hàng</div>
            </div>
            <div className="rounded-2xl border-2 border-[#232B26] bg-white p-4 shadow-[3px_3px_0px_#232B26]">
              <div className="font-mono text-xs font-black uppercase text-[#232B26]/70">LÝ DO CHẤP NHẬN</div>
              <div className="font-black text-sm mt-1">Sai kích thước (size) / Lỗi sản xuất</div>
            </div>
            <div className="rounded-2xl border-2 border-[#232B26] bg-white p-4 shadow-[3px_3px_0px_#232B26]">
              <div className="font-mono text-xs font-black uppercase text-[#232B26]/70">ĐIỀU KIỆN SẢN PHẨM</div>
              <div className="font-black text-sm mt-1">Nguyên tem mác, chưa bị thú cưng cào rách</div>
            </div>
          </div>
        </header>

        {/* Detailed Sections */}
        <main className="space-y-8">
          {/* SECTION 1 */}
          <article id="sec-timeline-reasons" className="rounded-[2rem] border-4 border-[#232B26] bg-white p-6 shadow-[8px_8px_0px_#232B26] md:p-8">
            <div className="mb-4 flex items-center justify-between border-b-2 border-[#232B26] pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#232B26] bg-[#FF3B30] font-mono text-sm font-black text-white">
                  01
                </span>
                <h2 className="text-xl font-black uppercase text-[#232B26] sm:text-2xl">
                  Thời Hạn 7 Ngày & Lý Do Được Đổi Trả
                </h2>
              </div>
              <button
                type="button"
                onClick={() => handleCopyLink("sec-timeline-reasons")}
                className="font-mono text-xs font-bold uppercase underline text-[#232B26]/70 hover:text-[#00A170]"
              >
                {copiedSection === "sec-timeline-reasons" ? "[COPIED!]" : "[COPY LINK]"}
              </button>
            </div>

            <div className="space-y-4 font-sans text-base leading-relaxed text-[#232B26]/90">
              <p>
                Pet Care Dog Dex cam kết hỗ trợ đổi trả các sản phẩm vòng cổ chó cho khách hàng trong thời gian <strong>07 (bảy) ngày kể từ khi khách hàng ký nhận hàng từ shipper</strong>.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                <div className="rounded-2xl border-2 border-[#232B26] bg-[#F0EDE6] p-5">
                  <div className="font-mono text-xs font-black uppercase text-[#FF3B30]">TRƯỜNG HỢP 01</div>
                  <div className="font-black text-base text-[#232B26] mt-1">Giao Sai Kích Thước (Size)</div>
                  <p className="text-sm text-[#232B26]/80 mt-1">
                    Vòng cổ chó nhận được không đúng kích cỡ (S, M, L, XL) đã chọn trong đơn hàng hoặc không vừa vặn vòng cổ thú cưng của bạn.
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-[#232B26] bg-[#F0EDE6] p-5">
                  <div className="font-mono text-xs font-black uppercase text-[#FF3B30]">TRƯỜNG HỢP 02</div>
                  <div className="font-black text-base text-[#232B26] mt-1">Lỗi Từ Nhà Sản Xuất</div>
                  <p className="text-sm text-[#232B26]/80 mt-1">
                    Sản phẩm phát hiện đứt chỉ may, khóa gài nhựa bị giòn gãy, móc kim loại hỏng hoặc bung niêm phong khi vừa mở hộp.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* SECTION 2 */}
          <article id="sec-product-conditions" className="rounded-[2rem] border-4 border-[#232B26] bg-white p-6 shadow-[8px_8px_0px_#232B26] md:p-8">
            <div className="mb-4 flex items-center justify-between border-b-2 border-[#232B26] pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#232B26] bg-[#FFD6A5] font-mono text-sm font-black text-[#232B26]">
                  02
                </span>
                <h2 className="text-xl font-black uppercase text-[#232B26] sm:text-2xl">
                  Điều Kiện Quy Chuẩn Bắt Buộc Của Sản Phẩm Đổi Trả
                </h2>
              </div>
              <button
                type="button"
                onClick={() => handleCopyLink("sec-product-conditions")}
                className="font-mono text-xs font-bold uppercase underline text-[#232B26]/70 hover:text-[#00A170]"
              >
                {copiedSection === "sec-product-conditions" ? "[COPIED!]" : "[COPY LINK]"}
              </button>
            </div>

            <div className="space-y-4 font-sans text-base leading-relaxed text-[#232B26]/90">
              <p>
                Để đảm bảo công bằng và vệ sinh an toàn cho các thú cưng khác, sản phẩm vòng cổ chó đổi trả phải đạt 100% các tiêu chuẩn sau:
              </p>

              <div className="rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] p-6 space-y-4 shadow-[4px_4px_0px_#232B26]">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg border-2 border-[#232B26] bg-[#85E0C0] px-3 py-1 font-mono text-xs font-black">
                    TIÊU CHUẨN A
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#232B26]">Còn Nguyên Tem Mác & Nhãn Niêm Phong</h4>
                    <p className="text-sm text-[#232B26]/80">Vòng cổ phải còn đầy đủ nhãn mác thương hiệu Pet Care Dog Dex, thẻ size và màng bọc chưa tháo dỡ.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg border-2 border-[#232B26] bg-[#FFD6A5] px-3 py-1 font-mono text-xs font-black">
                    TIÊU CHUẨN B
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#232B26]">Sản Phẩm Chưa Qua Sử Dụng Thực Tế</h4>
                    <p className="text-sm text-[#232B26]/80">Chưa bị đeo đi ra ngoài, chưa dính bẩn, không dính chất bẩn hoặc mùi hôi thực địa.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg border-2 border-[#232B26] bg-[#FF3B30] px-3 py-1 font-mono text-xs font-black text-white">
                    TIÊU CHUẨN C
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#232B26]">Chưa Bị Thú Cưng Cào Rách / Gặm Nhấm</h4>
                    <p className="text-sm text-[#232B26]/80">Bề mặt chất liệu da/vải nylon của vòng cổ không có vết răng vật nuôi gặm hoặc vết móng cào rách.</p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </main>

        {/* Footer Jump Bar */}
        <footer className="rounded-2xl border-4 border-[#232B26] bg-[#FFD6A5] p-6 shadow-[6px_6px_0px_#232B26]">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <div className="font-mono text-xs font-black uppercase text-[#232B26]">CÁC CHÍNH SÁCH KHÁC</div>
              <div className="text-sm font-bold text-[#232B26]">Xem thêm quy định vận chuyển và bảo mật</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/policies/privacy"
                className="rounded-xl border-2 border-[#232B26] bg-white px-4 py-2 text-xs font-bold text-[#232B26] hover:bg-[#85E0C0]"
              >
                Chính Sách Bảo Mật →
              </Link>
              <Link
                href="/policies/terms"
                className="rounded-xl border-2 border-[#232B26] bg-white px-4 py-2 text-xs font-bold text-[#232B26] hover:bg-[#FFD6A5]"
              >
                Điều Khoản Sử Dụng →
              </Link>
              <Link
                href="/policies/shipping"
                className="rounded-xl border-2 border-[#232B26] bg-white px-4 py-2 text-xs font-bold text-[#232B26] hover:bg-[#00A170] hover:text-white"
              >
                Chính Sách Vận Chuyển →
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
