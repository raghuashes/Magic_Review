export enum LanguageStyle {
  ENGLISH = 'ENGLISH',
  TELUGU_ENGLISH_MIX = 'TELUGU_ENGLISH_MIX',
  HINGLISH = 'HINGLISH',
}

export enum EventType {
  PAGE_VIEW = 'PAGE_VIEW',
  DRAFT_GENERATED = 'DRAFT_GENERATED',
  GOOGLE_LINK_CLICKED = 'GOOGLE_LINK_CLICKED',
}

export interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  googleReviewUrl: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoreResponse extends Store {
  defaultLanguageStyle: LanguageStyle;
}

export interface Category {
  id: string;
  name: string;
  active: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface Attribute {
  id: string;
  label: string;
  categoryId?: string | null;
  active: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface StoreRequest {
  name: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  googleReviewUrl: string;
  active?: boolean;
}

export interface CategoryRequest {
  name: string;
  active?: boolean;
  displayOrder?: number;
}

export interface AttributeRequest {
  label: string;
  active?: boolean;
  displayOrder?: number;
}

export interface ReviewGenerationRequest {
  categoryId: string;
  attributeIds?: string[];
  customerNote?: string;
  languageStyle: LanguageStyle;
}

export interface ReviewGenerationResponse {
  reviewText: string;
  mode: 'ai' | 'demo';
}

export interface AnalyticsRequest {
  eventType: EventType;
}

export interface AnalyticsResponse {
  totalVisits: number;
  draftsGenerated: number;
  googleLinkClicks: number;
  visitsByDay: Record<string, number>;
  draftsByDay: Record<string, number>;
  clicksByDay: Record<string, number>;
  recentEvents: Array<{
    timestamp: string;
    eventType: string;
  }>;
}

export interface PublicStoreResponse {
  store: StoreResponse;
  categories: Category[];
  attributes: Attribute[];
}

export interface PublicStore extends Store {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  googleReviewUrl: string;
  active: boolean;
}

export interface AttributeResponse extends Attribute {}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}