"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";

export function CheckoutView() {
  const { toast } = useToast();

  const [collarSize, setCollarSize] = useState<"S" | "M" | "L">("M");
  const [collarColor, setCollarColor] = useState("Emerald Green");
  const [dogName, setDogName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("Hanoi");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priceMap = {
    S: 249000,
    M: 299000,
    L: 349000,
  };

  const selectedPrice = priceMap[collarSize];

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate MoMo checkout payment initiation
      await new Promise((res) => setTimeout(res, 1200));
      toast.success(
        "ORDER PLACED",
        `Order for "${dogName}" Smart QR Collar (${collarSize}) confirmed! Redirecting to MoMo payment...`
      );
    } catch {
      toast.error("ORDER ERROR", "Could not initiate payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EDE6] px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 rounded-[2rem] border-4 border-[#232B26] bg-[#232B26] p-6 text-white shadow-[6px_6px_0px_#232B26]">
          <span className="font-mono text-xs font-black uppercase text-[#85E0C0]">
            SMART QR COLLAR E-COMMERCE
          </span>
          <h1 className="mt-1 text-3xl font-black tracking-tight">ĐẶT MUA VÒNG CỔ MÃ QR</h1>
        </header>

        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Collar Customization Section */}
          <div className="md:col-span-7 flex flex-col gap-6 rounded-[2rem] border-4 border-[#232B26] bg-white p-6 shadow-[8px_8px_0px_#232B26]">
            <h2 className="font-mono text-base font-black uppercase text-[#232B26]">
              1. TÙY CHỈNH VÒNG CỔ & THẺ KHẮC
            </h2>

            {/* Size Picker */}
            <div>
              <label className="block font-mono text-xs font-bold text-[#232B26]">Kích cỡ Vòng Cổ (Collar Size)</label>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {(["S", "M", "L"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCollarSize(s)}
                    className={`rounded-2xl border-2 border-[#232B26] p-3 text-center font-mono text-sm font-black transition ${
                      collarSize === s
                        ? "bg-[#85E0C0] text-[#232B26] shadow-[3px_3px_0px_#232B26]"
                        : "bg-white text-[#232B26]"
                    }`}
                  >
                    Size {s}
                    <span className="block text-[10px] font-normal">
                      {s === "S" ? "< 10kg" : s === "M" ? "10–25kg" : "> 25kg"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <label className="block font-mono text-xs font-bold text-[#232B26]">Màu sắc dây đeo</label>
              <select
                value={collarColor}
                onChange={(e) => setCollarColor(e.target.value)}
                className="mt-2 w-full rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] px-4 py-3 font-mono text-sm font-bold text-[#232B26] focus:outline-none"
              >
                <option value="Emerald Green">Xanh Lục Bảo (Emerald Green)</option>
                <option value="Matte Black">Đen Nhám (Matte Black)</option>
                <option value="Sunset Orange">Cam Hoàng Hôn (Sunset Orange)</option>
                <option value="Ruby Red">Đỏ Ruby (Ruby Red)</option>
              </select>
            </div>

            {/* Custom Engraving */}
            <div className="rounded-xl border-2 border-[#232B26]/30 bg-[#F0EDE6] p-4">
              <h4 className="font-mono text-xs font-black uppercase text-[#D97706]">
                🏷️ Chữ khắc trên thẻ kim loại (Custom Engraving)
              </h4>

              <div className="mt-3 flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#232B26]">Tên cún khắc lên thẻ</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Mochi"
                    value={dogName}
                    onChange={(e) => setDogName(e.target.value)}
                    className="mt-1 w-full rounded-xl border-2 border-[#232B26] bg-white px-4 py-2 font-mono text-sm font-bold text-[#232B26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#232B26]">SĐT khẩn cấp khắc lên thẻ</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 0987 654 321"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="mt-1 w-full rounded-xl border-2 border-[#232B26] bg-white px-4 py-2 font-mono text-sm font-bold text-[#232B26]"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Info Form */}
            <h2 className="mt-4 font-mono text-base font-black uppercase text-[#232B26]">
              2. THÔNG TIN GIAO HÀNG
            </h2>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-[#232B26]">Tên người nhận</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] px-4 py-2 font-mono text-sm font-bold text-[#232B26]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#232B26]">Số điện thoại nhận hàng</label>
                <input
                  type="text"
                  required
                  placeholder="0987 654 321"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] px-4 py-2 font-mono text-sm font-bold text-[#232B26]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#232B26]">Địa chỉ chi tiết</label>
                <input
                  type="text"
                  required
                  placeholder="Số 123 đường ABC, Phường X, Quận Y"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] px-4 py-2 font-mono text-sm font-bold text-[#232B26]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#232B26]">Tỉnh / Thành phố</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] px-4 py-2 font-mono text-sm font-bold text-[#232B26]"
                >
                  <option value="Hanoi">Hà Nội</option>
                  <option value="Ho Chi Minh City">TP. Hồ Chí Minh</option>
                  <option value="Da Nang">Đà Nẵng</option>
                  <option value="Hai Phong">Hải Phòng</option>
                  <option value="Can Tho">Cần Thơ</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Summary Box */}
          <div className="md:col-span-5 flex flex-col justify-between rounded-[2rem] border-4 border-[#232B26] bg-[#232B26] p-6 text-white shadow-[8px_8px_0px_#232B26]">
            <div>
              <h2 className="font-mono text-base font-black uppercase text-[#85E0C0]">
                TỔNG QUAN ĐƠN HÀNG
              </h2>

              <div className="mt-6 flex flex-col gap-3 border-b-2 border-dashed border-white/20 pb-4 text-xs font-mono">
                <div className="flex justify-between">
                  <span>Sản phẩm:</span>
                  <span className="font-bold">Vòng Cổ QR (Size {collarSize})</span>
                </div>
                <div className="flex justify-between">
                  <span>Màu sắc:</span>
                  <span className="font-bold">{collarColor}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tên khắc:</span>
                  <span className="font-bold text-[#FFD6A5]">{dogName || "Chưa nhập"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span className="font-bold text-[#85E0C0]">Miễn phí</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-mono text-sm uppercase">Tổng tiền:</span>
                <span className="font-mono text-2xl font-black text-[#85E0C0]">
                  {selectedPrice.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border-4 border-white bg-[#85E0C0] py-4 font-mono text-base font-black uppercase text-[#232B26] shadow-[4px_4px_0px_white] transition hover:bg-white active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
            >
              <span>{isSubmitting ? "Đang xử lý..." : "Thanh Toán MoMo"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
