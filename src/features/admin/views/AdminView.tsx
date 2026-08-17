"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";

type PhysicalOrderAdminItem = {
  id: string;
  dogName: string;
  collarSize: string;
  collarColor: string;
  recipientName: string;
  phone: string;
  address: string;
  amount: number;
  status: "pending" | "paid" | "shipped" | "delivered";
  createdAt: string;
};

export function AdminView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"orders" | "scans" | "users">("orders");

  const [orders, setOrders] = useState<PhysicalOrderAdminItem[]>([
    {
      id: "ORD-9901",
      dogName: "Mochi",
      collarSize: "M",
      collarColor: "Emerald Green",
      recipientName: "Nguyen Van A",
      phone: "0987654321",
      address: "123 Tay Ho, Hanoi",
      amount: 299000,
      status: "paid",
      createdAt: "2026-08-17 10:15",
    },
    {
      id: "ORD-9902",
      dogName: "Kuro",
      collarSize: "S",
      collarColor: "Sunset Orange",
      recipientName: "Tran Thi B",
      phone: "0901234567",
      address: "456 Le Loi, HCMC",
      amount: 249000,
      status: "shipped",
      createdAt: "2026-08-16 16:40",
    },
  ]);

  const handleUpdateStatus = (id: string, newStatus: PhysicalOrderAdminItem["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    toast.success("ORDER UPDATED", `Order ${id} status changed to ${newStatus.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-[#F0EDE6] px-4 py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-[2.5rem] border-4 border-[#232B26] bg-[#232B26] p-8 text-white shadow-[8px_8px_0px_#232B26]">
          <span className="font-mono text-xs font-black uppercase text-[#85E0C0]">
            SYSTEM CONTROL PANEL
          </span>
          <h1 className="mt-1 text-3xl md:text-5xl font-black tracking-tight">
            ADMIN DASHBOARD
          </h1>
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-3 mb-6 font-mono text-xs font-black">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`rounded-2xl border-2 border-[#232B26] px-5 py-3 transition ${
              activeTab === "orders"
                ? "bg-[#85E0C0] text-[#232B26] shadow-[4px_4px_0px_#232B26]"
                : "bg-white text-[#232B26]"
            }`}
          >
            📦 QR Collar Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("scans")}
            className={`rounded-2xl border-2 border-[#232B26] px-5 py-3 transition ${
              activeTab === "scans"
                ? "bg-[#85E0C0] text-[#232B26] shadow-[4px_4px_0px_#232B26]"
                : "bg-white text-[#232B26]"
            }`}
          >
            📊 QR Scan Logs (142 Scans)
          </button>
        </div>

        {/* Orders Table */}
        {activeTab === "orders" && (
          <div className="overflow-hidden rounded-3xl border-4 border-[#232B26] bg-white p-6 shadow-[8px_8px_0px_#232B26]">
            <h3 className="font-mono text-lg font-black text-[#232B26] mb-4">Physical QR Collar Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b-2 border-[#232B26] text-[#232B26]">
                    <th className="pb-3 font-black">Order ID</th>
                    <th className="pb-3 font-black">Dog Name</th>
                    <th className="pb-3 font-black">Recipient</th>
                    <th className="pb-3 font-black">Amount</th>
                    <th className="pb-3 font-black">Status</th>
                    <th className="pb-3 font-black">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232B26]/10">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#F0EDE6]/50">
                      <td className="py-3 font-bold text-[#232B26]">{o.id}</td>
                      <td className="py-3 font-bold text-[#D97706]">{o.dogName} ({o.collarSize})</td>
                      <td className="py-3 font-medium text-[#232B26]">{o.recipientName} ({o.phone})</td>
                      <td className="py-3 font-bold text-[#232B26]">{o.amount.toLocaleString("vi-VN")} đ</td>
                      <td className="py-3">
                        <span
                          className={`rounded-lg px-2.5 py-1 text-[10px] font-black uppercase border border-[#232B26] ${
                            o.status === "paid"
                              ? "bg-[#85E0C0] text-[#232B26]"
                              : o.status === "shipped"
                              ? "bg-[#FFD6A5] text-[#232B26]"
                              : "bg-gray-200 text-[#232B26]"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateStatus(o.id, e.target.value as PhysicalOrderAdminItem["status"])}
                          className="rounded-lg border border-[#232B26] bg-white px-2 py-1 text-[11px] font-bold text-[#232B26]"
                        >
                          <option value="pending">pending</option>
                          <option value="paid">paid</option>
                          <option value="shipped">shipped</option>
                          <option value="delivered">delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Scan Log Tab */}
        {activeTab === "scans" && (
          <div className="rounded-3xl border-4 border-[#232B26] bg-white p-6 shadow-[8px_8px_0px_#232B26]">
            <h3 className="font-mono text-lg font-black text-[#232B26] mb-2">Live QR Tag Scan Metrics</h3>
            <p className="text-xs text-[#232B26]/70 mb-4">Real-time GPS dispatch logs when public QR collar tags are scanned.</p>
            <div className="space-y-3 font-mono text-xs">
              <div className="rounded-xl border border-[#232B26]/20 bg-[#F0EDE6] p-3 flex justify-between items-center">
                <span>📍 Tag ID: <strong>DD-GOLD-9988</strong> (Mochi)</span>
                <span className="text-[#D97706] font-bold">GPS: 21.028511, 105.854444 (Hanoi) — 10m ago</span>
              </div>
              <div className="rounded-xl border border-[#232B26]/20 bg-[#F0EDE6] p-3 flex justify-between items-center">
                <span>📍 Tag ID: <strong>DD-SHIB-4412</strong> (Kuro)</span>
                <span className="text-[#D97706] font-bold">GPS: 10.776889, 106.700806 (HCMC) — 2h ago</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
