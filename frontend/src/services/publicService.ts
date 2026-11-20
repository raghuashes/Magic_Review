import api from './api';
import { PublicStoreResponse, ReviewGenerationRequest, ReviewGenerationResponse, AnalyticsRequest } from '../types';

export const publicService = {
  async getPublicStore(slug: string): Promise<PublicStoreResponse> {
    const response = await api.get<PublicStoreResponse>(`/public/stores/${slug}`);
    return response.data;
  },

  async generateReview(slug: string, data: ReviewGenerationRequest): Promise<ReviewGenerationResponse> {
    const response = await api.post<ReviewGenerationResponse>(`/public/stores/${slug}/generate-review`, data);
    return response.data;
  },

  async trackEvent(slug: string, data: AnalyticsRequest): Promise<void> {
    await api.post(`/public/stores/${slug}/events`, data);
  },
};