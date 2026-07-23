import { env } from "@/lib/env";
import type { ScanResult } from "@/shared/types/scan";

export const scanService = {
  async scanImage(_file: File): Promise<ScanResult> {
    const response = await fetch(`${env.apiBaseUrl}/scan`, {
      method: "POST",
    });
    return response.json();
  },
};
