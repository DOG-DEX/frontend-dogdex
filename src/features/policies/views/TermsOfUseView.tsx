"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";

/**
 * TermsOfUseView Component
 * Dedicated View for Terms of Use (Điều khoản sử dụng)
 * Architecture: src/features/policies/views/TermsOfUseView.tsx
 * Design Vibe: Neo-Brutalist Pop (#F0EDE6 bg, #FFD6A5 peach accents, #232B26 borders)
 * NO ICON LIBRARIES USED.
 */
export function TermsOfUseView() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopyLink = (sectionId: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/policies/terms#${sectionId}`;
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
            <span className="rounded-md border border-[#232B26] bg-[#FFD6A5] px-2 py-0.5 text-[#232B26]">
              TERMS OF USE
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
        <header className="relative overflow-hidden rounded-[2.5rem] border-4 border-[#232B26] bg-[#FFD6A5] p-8 shadow-[10px_10px_0px_#232B26] md:p-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-[#232B26] bg-white px-4 py-1 font-mono text-xs font-black uppercase text-[#232B26]">
            <span>SERVICE AGREEMENT</span>
            <span>•</span>
            <span>CUSTOMER RESPONSIBILITY</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#232B26] sm:text-4xl md:text-5xl">
            Điều Khoản Sử Dụng Dịch Vụ
          </h1>
          <p className="mt-3 max-w-2xl font-sans text-base font-bold text-[#232B26]/90 md:text-lg">
            Quy định trách nhiệm khai báo thông tin khách hàng, chính sách giá niêm yết bằng VNĐ và các hình thức thanh toán COD / Chuyển khoản.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border-2 border-[#232B26] bg-white p-4 shadow-[3px_3px_0px_#232B26]">
              <div className="font-mono text-xs font-black uppercase text-[#232B26]/70">KHAI BÁO THÔNG TIN</div>
              <div className="font-black text-sm mt-1">Cam kết đúng Họ tên, SĐT, Email</div>
            </div>
            <div className="rounded-2xl border-2 border-[#232B26] bg-white p-4 shadow-[3px_3px_0px_#232B26]">
              <div className="font-mono text-xs font-black uppercase text-[#232B26]/70">ĐƠN VỊ TIỀN TỆ</div>
              <div className="font-black text-sm mt-1">Giá niêm yết chuẩn Việt Nam Đồng (VNĐ)</div>
            </div>
            <div className="rounded-2xl border-2 border-[#232B26] bg-white p-4 shadow-[3px_3px_0px_#232B26]">
              <div className="font-mono text-xs font-black uppercase text-[#232B26]/70">THANH TOÁN</div>
              <div className="font-black text-sm mt-1">Hỗ trợ COD & Chuyển khoản QR</div>
            </div>
          </div>
        </header>

        {/* Detailed Sections */}
        <main className="space-y-8">
          {/* SECTION 1 */}
          <article id="sec-user-declaration" className="rounded-[2rem] border-4 border-[#232B26] bg-white p-6 shadow-[8px_8px_0px_#232B26] md:p-8">
            <div className="mb-4 flex items-center justify-between border-b-2 border-[#232B26] pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#232B26] bg-[#FFD6A5] font-mono text-sm font-black">
                  01
                </span>
                <h2 className="text-xl font-black uppercase text-[#232B26] sm:text-2xl">
                  Trách Nhiệm Cam Kết Khai Báo Thông Tin Chính Xác
                </h2>
              </div>
              <button
                type="button"
                onClick={() => handleCopyLink("sec-user-declaration")}
                className="font-mono text-xs font-bold uppercase underline text-[#232B26]/70 hover:text-[#00A170]"
              >
                {copiedSection === "sec-user-declaration" ? "[COPIED!]" : "[COPY LINK]"}
              </button>
            </div>

            <div className="space-y-4 font-sans text-base leading-relaxed text-[#232B26]/90">
              <p>
                Khi thực hiện giao dịch mua vòng cổ chó hoặc đặt lịch các dịch vụ chăm sóc thú cưng Pet Care, quý khách hàng <strong>cam kết khai báo thông tin trung thực, chính xác và đầy đủ 100%</strong> bao gồm:
              </p>

              <div className="rounded-2xl border-2 border-[#232B26] bg-[#F0EDE6] p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="rounded-md border border-[#232B26] bg-white px-2 py-0.5 font-mono text-xs font-bold">1</span>
                  <div>
                    <strong>Họ và tên chính chủ:</strong> Cần trùng khớp với thông tin người nhận để đảm bảo shipper giao đúng người nhận.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="rounded-md border border-[#232B26] bg-white px-2 py-0.5 font-mono text-xs font-bold">2</span>
                  <div>
                    <strong>Số điện thoại đang hoạt động:</strong> Phải là số liên lạc chính xác để nhân viên chăm sóc khách hàng và shippper gọi điện liên hệ nhận hàng.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="rounded-md border border-[#232B26] bg-white px-2 py-0.5 font-mono text-xs font-bold">3</span>
                  <div>
                    <strong>Địa chỉ Email hợp lệ:</strong> Nhận mã hóa đơn dịch vụ Pet Care, thông tin theo dõi vận đơn và quyền Hủy nhận tin (Unsubscribe).
                  </div>
                </div>
              </div>

              <div className="rounded-xl border-2 border-[#232B26] bg-[#FFD6A5] p-4 font-bold text-[#232B26]">
                LƯU Ý PHÁP LÝ: Pet Care Dog Dex có quyền tạm ngưng xử lý hoặc hủy bỏ đơn hàng nếu phát hiện thông tin khai báo có dấu hiệu giả mạo, sai lệch gây cản trở công tác phát hàng vòng cổ chó.
              </div>
            </div>
          </article>

          {/* SECTION 2 */}
          <article id="sec-pricing-payment" className="rounded-[2rem] border-4 border-[#232B26] bg-white p-6 shadow-[8px_8px_0px_#232B26] md:p-8">
            <div className="mb-4 flex items-center justify-between border-b-2 border-[#232B26] pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#232B26] bg-[#85E0C0] font-mono text-sm font-black">
                  02
                </span>
                <h2 className="text-xl font-black uppercase text-[#232B26] sm:text-2xl">
                  Giá Cả Niêm Yết VNĐ & Phương Thức Thanh Toán
                </h2>
              </div>
              <button
                type="button"
                onClick={() => handleCopyLink("sec-pricing-payment")}
                className="font-mono text-xs font-bold uppercase underline text-[#232B26]/70 hover:text-[#00A170]"
              >
                {copiedSection === "sec-pricing-payment" ? "[COPIED!]" : "[COPY LINK]"}
              </button>
            </div>

            <div className="space-y-4 font-sans text-base leading-relaxed text-[#232B26]/90">
              <p>
                Tất cả các sản phẩm vòng cổ chó (size S, M, L, XL, bản da, bản vải reflective) và các gói dịch vụ Pet Care đều được niêm yết giá minh bạch bằng đơn vị <strong>Đồng Việt Nam (VNĐ)</strong>.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                <div className="rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] p-6 shadow-[4px_4px_0px_#232B26]">
                  <div className="mb-2 inline-block rounded-md border border-[#232B26] bg-[#FF6B00] px-2.5 py-0.5 font-mono text-xs font-black uppercase text-white">
                    METHOD 01 / COD
                  </div>
                  <h3 className="text-lg font-black uppercase text-[#232B26]">Thanh Toán Khi Nhận Hàng (COD)</h3>
                  <p className="text-sm font-medium text-[#232B26]/90 mt-2">
                    Khách hàng kiểm tra sản phẩm vòng cổ chó trực tiếp khi shipper bàn giao, sau đó thanh toán tiền mặt đúng số tiền VNĐ ghi trên hóa đơn.
                  </p>
                </div>

                <div className="rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] p-6 shadow-[4px_4px_0px_#232B26]">
                  <div className="mb-2 inline-block rounded-md border border-[#232B26] bg-[#00A170] px-2.5 py-0.5 font-mono text-xs font-black uppercase text-white">
                    METHOD 02 / BANK TRANSFER
                  </div>
                  <h3 className="text-lg font-black uppercase text-[#232B26]">Chuyển Khoản Trực Tuyến / QR Code</h3>
                  <p className="text-sm font-medium text-[#232B26]/90 mt-2">
                    Quét mã QR VietQR hoặc chuyển khoản trực tiếp vào tài khoản ngân hàng chính thức của Pet Care Dog Dex tại bước Checkout đơn hàng.
                  </p>
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
              <div className="text-sm font-bold text-[#232B26]">Tham khảo thêm các quy định bảo vệ người tiêu dùng</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/policies/privacy"
                className="rounded-xl border-2 border-[#232B26] bg-white px-4 py-2 text-xs font-bold text-[#232B26] hover:bg-[#FFD6A5]"
              >
                Chính Sách Bảo Mật →
              </Link>
              <Link
                href="/policies/refund"
                className="rounded-xl border-2 border-[#232B26] bg-white px-4 py-2 text-xs font-bold text-[#232B26] hover:bg-[#FF3B30] hover:text-white"
              >
                Chính Sách Đổi Trả →
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
