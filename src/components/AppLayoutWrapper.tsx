"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./SiteFooter";
import { SiteNav } from "./SiteNav";

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  // Check if current page is Login or Register
  const isAuthPage =
    pathname.includes("/login") || pathname.includes("/register");

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
