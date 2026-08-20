import { apiFetch } from '@/lib/api';
import type { PredictionSubmission } from '@/shared/types/scan';

export interface ScanResultPayload {
  breed?: string;
  confidence?: number;
  predictions?: Array<{
    class?: string;
    breed?: string;
    confidence?: number;
    box?: [number, number, number, number];
  }>;
  topMatches?: Array<{ breed: string; confidence: number }>;
  processedMediaBase64?: string;
  processed_media_base64?: string;
  box?: [number, number, number, number];
  id?: string;
}

export const scanService = {
  async scanImage(file: File): Promise<PredictionSubmission> {
    const body = new FormData();
    body.set('file', file);
    body.set('type', 'image');
    return apiFetch<PredictionSubmission>('/api/predictions/predict/image', {
      method: 'POST',
      body,
    });
  },

  async scanVideo(file: File): Promise<PredictionSubmission> {
    const body = new FormData();
    body.set('file', file);
    body.set('type', 'video');
    return apiFetch<PredictionSubmission>('/api/predictions/predict/video', {
      method: 'POST',
      body,
    });
  },

  connectStreamPrediction(): WebSocket {
    const baseUrl =
      process.env.NEXT_PUBLIC_WS_URL ||
      process.env.NEXT_PUBLIC_API_URL?.replace(/^http/, 'ws') ||
      'ws://localhost:5000';
    const wsUrl = `${baseUrl.replace(/\/+$/, '')}/api/predictions/stream`;
    return new WebSocket(wsUrl);
  },
};

