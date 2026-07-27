import { apiFetch } from '@/lib/api';
import type { PredictionSubmission } from '@/shared/types/scan';

export const scanService = {
  async scanImage(file: File): Promise<PredictionSubmission> {
    const body = new FormData();
    body.set('file', file);
    body.set('type', 'image');
    return apiFetch<PredictionSubmission>('/api/predictions/predict', {
      method: 'POST',
      body,
    });
  },
};
