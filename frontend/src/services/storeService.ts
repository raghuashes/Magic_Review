import api from './api';
import { StoreRequest, Category, CategoryRequest, Attribute, AttributeRequest, StoreResponse } from '../types';

export const storeService = {
  async getStores(): Promise<StoreResponse[]> {
    const response = await api.get<StoreResponse[]>('/stores');
    return response.data;
  },

  async createStore(data: StoreRequest): Promise<StoreResponse> {
    const response = await api.post<StoreResponse>('/stores', data);
    return response.data;
  },

  async getStore(id: string): Promise<StoreResponse> {
    const response = await api.get<StoreResponse>(`/stores/${id}`);
    return response.data;
  },

  async updateStore(id: string, data: StoreRequest): Promise<StoreResponse> {
    const response = await api.put<StoreResponse>(`/stores/${id}`, data);
    return response.data;
  },

  async deleteStore(id: string): Promise<void> {
    await api.delete(`/stores/${id}`);
  },

  async getQrCode(id: string): Promise<Blob> {
    const response = await api.get(`/stores/${id}/qr`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Categories
  async getCategories(storeId: string): Promise<Category[]> {
    const response = await api.get<Category[]>(`/stores/${storeId}/categories`);
    return response.data;
  },

  async createCategory(storeId: string, data: CategoryRequest): Promise<Category> {
    const response = await api.post<Category>(`/stores/${storeId}/categories`, data);
    return response.data;
  },

  async updateCategory(storeId: string, categoryId: string, data: CategoryRequest): Promise<Category> {
    const response = await api.put<Category>(`/stores/${storeId}/categories/${categoryId}`, data);
    return response.data;
  },

  async deleteCategory(storeId: string, categoryId: string): Promise<void> {
    await api.delete(`/stores/${storeId}/categories/${categoryId}`);
  },

  // Attributes
  async getAttributes(storeId: string): Promise<Attribute[]> {
    const response = await api.get<Attribute[]>(`/stores/${storeId}/attributes`);
    return response.data;
  },

  async createAttribute(storeId: string, data: AttributeRequest): Promise<Attribute> {
    const response = await api.post<Attribute>(`/stores/${storeId}/attributes`, data);
    return response.data;
  },

  async updateAttribute(storeId: string, attributeId: string, data: AttributeRequest): Promise<Attribute> {
    const response = await api.put<Attribute>(`/stores/${storeId}/attributes/${attributeId}`, data);
    return response.data;
  },

  async deleteAttribute(storeId: string, attributeId: string): Promise<void> {
    await api.delete(`/stores/${storeId}/attributes/${attributeId}`);
  },

  async getAnalytics(storeId: string) {
    const response = await api.get(`/stores/${storeId}/analytics`);
    return response.data;
  },
};