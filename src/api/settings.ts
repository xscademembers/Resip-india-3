import apiClient from './client';

/** Public site settings keyed by their setting name (tax, shipping, contact, etc.). */
export type PublicSettings = Record<string, unknown>;

export interface PublicBanner {
  _id: string;
  title?: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  position?: string;
  sortOrder?: number;
}

export const settingsApi = {
  public: () =>
    apiClient
      .get<{ success: boolean; settings: PublicSettings }>('/settings/public')
      .then((r) => r.data.settings || {}),
};

export const bannersApi = {
  list: (position = 'hero') =>
    apiClient
      .get<{ success: boolean; banners: PublicBanner[] }>('/banners', { params: { position } })
      .then((r) => r.data.banners || []),
};
