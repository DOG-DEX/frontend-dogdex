"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";

/**
 * PrivacyPolicyView Component
 * Dedicated View for Privacy Policy (Chính sách bảo mật)
 * Architecture: src/features/policies/views/PrivacyPolicyView.tsx
 * Design Vibe: Neo-Brutalist Pop (#F0EDE6 bg, #85E0C0 mint accents, #232B26 borders)
 * NO ICON LIBRARIES USED.
 */
export function PrivacyPolicyView() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [unsubscribeSubmitted, setUnsubscribeSubmitted] = useState(false);
  const [unsubscribeEmail, setUnsubscribeEmail] = useState("");

  const handleCopyLink = (sectionId: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/policies/privacy#${sectionId}`;
      navigator.clipboard.writeText(url);
      setCopiedSection(sectionId);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  const handleUnsubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (unsubscribeEmail.trim()) {
      setUnsubscribeSubmitted(true);
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
            <span className="rounded-md border border-[#232B26] bg-[#85E0C0] px-2 py-0.5 text-[#232B26]">
              PRIVACY POLICY
            </span>
          </div>
          <Link
            href="/policies"
            className="btn-brutal rounded-xl bg-white px-4 py-2 font-mono text-xs font-black uppercase shadow-[3px_3px_0px_#232B26] transition hover:bg-[#FFD6A5]"
          >
            ← Tất Cả Chính Sách
          </Link>
        </div>

        {/* Hero Header Card */}
        <header className="relative overflow-hidden rounded-[2.5rem] border-4 border-[#232B26] bg-[#85E0C0] p-8 shadow-[10px_10px_0px_#232B26] md:p-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-[#232B26] bg-white px-4 py-1 font-mono text-xs font-black uppercase text-[#232B26]">
            <span>DATA PROTECTION</span>
            <span>•</span>
            <span>PET CARE & DOG COLLAR</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#232B26] sm:text-4xl md:text-5xl">
            Chính Sách Bảo Mật Thông Tin
          </h1>
          <p className="mt-3 max-w-2xl font-sans text-base font-bold text-[#232B26]/90 md:text-lg">
            Cam kết bảo vệ 100% dữ liệu cá nhân của quý khách khi đăng ký dịch vụ Pet Care và mua sắm vòng cổ chó tại Pet Care Dog Dex.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border-2 border-[#232B26] bg-white p-4 shadow-[3px_3px_0px_#232B26]">
              <div className="font-mono text-xs font-black uppercase text-[#232B26]/70">DỮ LIỆU THU THẬP</div>
              <div className="font-black text-sm mt-1">Họ tên, SĐT, Email & Địa chỉ</div>
            </div>
            <div className="rounded-2xl border-2 border-[#232B26] bg-white p-4 shadow-[3px_3px_0px_#232B26]">
              <div className="font-mono text-xs font-black uppercase text-[#232B26]/70">QUYỀN RIÊNG TƯ</div>
              <div className="font-black text-sm mt-1">Hủy Email/SMS Marketing 24/7</div>
            </div>
            <div className="rounded-2xl border-2 border-[#232B26] bg-white p-4 shadow-[3px_3px_0px_#232B26]">
              <div className="font-mono text-xs font-black uppercase text-[#232B26]/70">CAM KẾT CHIA SẺ</div>
              <div className="font-black text-sm mt-1">Không bán dữ liệu • Chỉ đối tác GHTK/GHN</div>
            </div>
          </div>
        </header>

        {/* Detailed Sections */}
        <main className="space-y-8">
          {/* SECTION 1 */}
          <article id="sec-collection" className="rounded-[2rem] border-4 border-[#232B26] bg-white p-6 shadow-[8px_8px_0px_#232B26] md:p-8">
            <div className="mb-4 flex items-center justify-between border-b-2 border-[#232B26] pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#232B26] bg-[#FFD6A5] font-mono text-sm font-black">
                  01
                </span>
                <h2 className="text-xl font-black uppercase text-[#232B26] sm:text-2xl">
                  Thu Thập Thông Tin Cá Nhân Khách Hàng
                </h2>
              </div>
              <button
                type="button"
                onClick={() => handleCopyLink("sec-collection")}
                className="font-mono text-xs font-bold uppercase underline text-[#232B26]/70 hover:text-[#00A170]"
              >
                {copiedSection === "sec-collection" ? "[COPIED!]" : "[COPY LINK]"}
              </button>
            </div>

            <div className="space-y-4 font-sans text-base leading-relaxed text-[#232B26]/90">
              <p>
                Để phục vụ việc xử lý đơn hàng vòng cổ chó chuyên dụng và cung cấp các dịch vụ chăm sóc thú cưng (Pet Care) một cách chính xác nhất, Pet Care Dog Dex thu thập các thông tin cá nhân cơ bản khi quý khách đăng ký tài khoản hoặc đặt mua hàng:
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                <div className="rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] p-4">
                  <div className="font-mono text-xs font-black uppercase text-[#FF6B00]">MỤC 01 • ĐỊNH DANH KHÁCH HÀNG</div>
                  <div className="font-bold text-base text-[#232B26] mt-1">Họ và Tên đầy đủ</div>
                  <p className="text-sm text-[#232B26]/80 mt-1">Dùng để ghi nhận quyền sở hữu tài khoản, in hóa đơn dịch vụ Pet Care và dán nhãn niêm phong trên bưu kiện vòng cổ chó.</p>
                </div>

                <div className="rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] p-4">
                  <div className="font-mono text-xs font-black uppercase text-[#00A170]">MỤC 02 • LIÊN LẠC GIAO NHẬN</div>
                  <div className="font-bold text-base text-[#232B26] mt-1">Số điện thoại chính thức</div>
                  <p className="text-sm text-[#232B26]/80 mt-1">Dùng cho nhân viên tư vấn xác nhận thông số size vòng cổ và shipper liên hệ khi tiến hành giao hàng tận nơi.</p>
                </div>

                <div className="rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] p-4">
                  <div className="font-mono text-xs font-black uppercase text-[#85E0C0]">MỤC 03 • THÔNG BÁO TÀI KHOẢN</div>
                  <div className="font-bold text-base text-[#232B26] mt-1">Địa chỉ Email cá nhân</div>
                  <p className="text-sm text-[#232B26]/80 mt-1">Dùng để gửi xác nhận đơn hàng, hóa đơn điện tử, thông báo bảo mật và thông tin ưu đãi Pet Care.</p>
                </div>

                <div className="rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] p-4">
                  <div className="font-mono text-xs font-black uppercase text-[#FF3B30]">MỤC 04 • ĐỊA ĐIỂM GIAO HÀNG</div>
                  <div className="font-bold text-base text-[#232B26] mt-1">Địa chỉ nhận hàng chi tiết</div>
                  <p className="text-sm text-[#232B26]/80 mt-1">Địa chỉ nhà, phường/xã, quận/huyện, tỉnh/thành phố để đơn vị vận chuyển giao sản phẩm trực tiếp.</p>
                </div>
              </div>
            </div>
          </article>

          {/* SECTION 2 */}
          <article id="sec-marketing" className="rounded-[2rem] border-4 border-[#232B26] bg-white p-6 shadow-[8px_8px_0px_#232B26] md:p-8">
            <div className="mb-4 flex items-center justify-between border-b-2 border-[#232B26] pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#232B26] bg-[#85E0C0] font-mono text-sm font-black">
                  02
                </span>
                <h2 className="text-xl font-black uppercase text-[#232B26] sm:text-2xl">
                  Mục Đích Sử Dụng Dữ Liệu & Quyền Unsubscribe Marketing
                </h2>
              </div>
              <button
                type="button"
                onClick={() => handleCopyLink("sec-marketing")}
                className="font-mono text-xs font-bold uppercase underline text-[#232B26]/70 hover:text-[#00A170]"
              >
                {copiedSection === "sec-marketing" ? "[COPIED!]" : "[COPY LINK]"}
              </button>
            </div>

            <div className="space-y-4 font-sans text-base leading-relaxed text-[#232B26]/90">
              <p>
                Dữ liệu cá nhân thu thập chỉ được dùng cho công tác vận hành hệ thống, chăm sóc khách hàng và các chương trình tiếp thị tiếp cận khách hàng.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Xử lý và vận chuyển đơn hàng vòng cổ chó theo đúng kích thước và kiểu dáng yêu cầu.</li>
                <li>Đặt lịch và hỗ trợ các dịch vụ Pet Care (tắm spa, tỉa lông, tiêm phòng, kiểm tra sức khỏe thú cưng).</li>
                <li>Gửi các bản tin Email Marketing và tin nhắn SMS Marketing về mẫu vòng cổ chó mới, voucher giảm giá dịch vụ.</li>
              </ul>

              {/* Unsubscribe Form Simulation Widget */}
              <div className="mt-6 rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] p-6 shadow-[4px_4px_0px_#232B26]">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-md border border-[#232B26] bg-[#85E0C0] px-2 py-0.5 font-mono text-xs font-black uppercase">
                    UNSUBSCRIBE PORTAL
                  </span>
                  <span className="font-mono text-xs font-bold text-[#232B26]/70">Quyền Hủy Nhận Tin Công Khai</span>
                </div>
                <p className="text-sm font-bold text-[#232B26] mb-4">
                  Quý khách có thể tự do Hủy nhận tin (Unsubscribe) Email/SMS Marketing bất kỳ lúc nào mà không gặp bất kỳ rào cản nào. Quý khách có thể bấm liên kết Unsubscribe ở cuối email hoặc nhập email bên dưới để hủy ngay lập tức:
                </p>

                {unsubscribeSubmitted ? (
                  <div className="rounded-xl border-2 border-[#232B26] bg-[#85E0C0] p-4 text-center font-bold text-[#232B26]">
                    ✓ Email <span className="underline">{unsubscribeEmail}</span> đã được ghi nhận hủy nhận thông tin truyền thông thành công!
                  </div>
                ) : (
                  <form onSubmit={handleUnsubscribe} className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="email"
                      required
                      placeholder="Nhập email của bạn để hủy nhận tiếp thị..."
                      value={unsubscribeEmail}
                      onChange={(e) => setUnsubscribeEmail(e.target.value)}
                      className="flex-1 rounded-xl border-2 border-[#232B26] bg-white px-4 py-2.5 text-sm font-medium text-[#232B26] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="btn-brutal rounded-xl bg-[#FF3B30] px-5 py-2.5 font-mono text-xs font-black uppercase text-white shadow-[3px_3px_0px_#232B26] transition hover:bg-[#232B26]"
                    >
                      Hủy Nhận Tin [UNSUBSCRIBE]
                    </button>
                  </form>
                )}
              </div>
            </div>
          </article>

          {/* SECTION 3 */}
          <article id="sec-sharing" className="rounded-[2rem] border-4 border-[#232B26] bg-white p-6 shadow-[8px_8px_0px_#232B26] md:p-8">
            <div className="mb-4 flex items-center justify-between border-b-2 border-[#232B26] pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#232B26] bg-[#FF3B30] font-mono text-sm font-black text-white">
                  03
                </span>
                <h2 className="text-xl font-black uppercase text-[#232B26] sm:text-2xl">
                  Cam Kết Không Bán Dữ Liệu & Đơn Vị Chia Sẻ
                </h2>
              </div>
              <button
                type="button"
                onClick={() => handleCopyLink("sec-sharing")}
                className="font-mono text-xs font-bold uppercase underline text-[#232B26]/70 hover:text-[#00A170]"
              >
                {copiedSection === "sec-sharing" ? "[COPIED!]" : "[COPY LINK]"}
              </button>
            </div>

            <div className="space-y-4 font-sans text-base leading-relaxed text-[#232B26]/90">
              <div className="rounded-2xl border-4 border-[#232B26] bg-[#FF3B30] p-5 text-white shadow-[4px_4px_0px_#232B26]">
                <div className="font-mono text-xs font-black uppercase tracking-wider text-white/80">
                  CAM KẾT BẢO MẬT TUYỆT ĐỐI
                </div>
                <p className="mt-1 text-lg font-black uppercase">
                  PET CARE DOG DEX KHÔNG BÁN, KHÔNG CHO THUÊ VÀ KHÔNG KINH DOANH DỮ LIỆU CÁ NHÂN CỦA KHÁCH HÀNG CHO BẤT KỲ BÊN THỨ BA NÀO.
                </p>
              </div>

              <p className="mt-4">
                Thông tin nhận hàng của khách hàng (Họ tên, SĐT, Địa chỉ giao vòng cổ chó) chỉ được chia sẻ duy nhất cho các <strong>đối tác vận chuyển uy tín được ủy quyền</strong> để phục vụ quá trình phát hàng:
              </p>

              {/* Logistics Partners Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mt-4">
                <div className="rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] p-3 text-center">
                  <div className="font-mono text-xs font-black text-[#00A170]">GHTK</div>
                  <div className="text-xs font-bold text-[#232B26] mt-0.5">Giao Hàng Tiết Kiệm</div>
                </div>
                <div className="rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] p-3 text-center">
                  <div className="font-mono text-xs font-black text-[#FF6B00]">GHN</div>
                  <div className="text-xs font-bold text-[#232B26] mt-0.5">Giao Hàng Nhanh</div>
                </div>
                <div className="rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] p-3 text-center">
                  <div className="font-mono text-xs font-black text-[#FF3B30]">VIETTEL POST</div>
                  <div className="text-xs font-bold text-[#232B26] mt-0.5">Bưu Chính Viettel</div>
                </div>
                <div className="rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] p-3 text-center">
                  <div className="font-mono text-xs font-black text-[#232B26]">AHAMOVE</div>
                  <div className="text-xs font-bold text-[#232B26] mt-0.5">Giao Hàng Hỏa Tốc</div>
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
              <div className="text-sm font-bold text-[#232B26]">Khám phá thêm các quy định tại Pet Care Dog Dex</div>
            </div>
            <div className="flex flex-wrap gap-2">
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
