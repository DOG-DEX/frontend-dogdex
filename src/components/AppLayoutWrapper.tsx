"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SiteFooter } from "./SiteFooter";
import { SiteNav } from "./SiteNav";
import { ToastProvider, useToast } from "./ToastContext";

function ToastConsumerContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const { toast } = useToast();

  // Check for pending success toast stored during login navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pendingStr = sessionStorage.getItem("pendingSuccessToast");
      if (pendingStr) {
        try {
          const pending = JSON.parse(pendingStr);
          toast.success(pending.title, pending.message, {
            badge: pending.badge || "NOW",
            duration: pending.duration || 5000,
          });
        } catch {
          // ignore parsing error
        } finally {
          sessionStorage.removeItem("pendingSuccessToast");
        }
      }
    }
  }, [pathname, toast]);

  // Check if current page is an auth page (no SiteNav/Footer)
  const isAuthPage =
    pathname.includes("/login") ||
    pathname.includes("/register") ||
    pathname.includes("/forgot-password");

  if (isAuthPage) {
    return <main className="flex-1 bg-[#F0EDE6]">{children}</main>;
  }

  return (
    <>
      <SiteNav />
      <main className="flex-1 bg-[#F0EDE6]">{children}</main>
      <SiteFooter />
    </>
  );
}

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ToastConsumerContent>{children}</ToastConsumerContent>
    </ToastProvider>
  );
}
