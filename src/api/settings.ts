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

let publicSettingsPromise: Promise<PublicSettings> | null = null;
let publicSettingsCache: PublicSettings | null = null;

export const settingsApi = {
  /** Shared cache so Home + Cart do not double-fetch on first load. */
  public: () => {
    if (publicSettingsCache) return Promise.resolve(publicSettingsCache);
    if (!publicSettingsPromise) {
      publicSettingsPromise = apiClient
        .get<{ success: boolean; settings: PublicSettings }>('/settings/public')
        .then((r) => {
          publicSettingsCache = r.data.settings || {};
          return publicSettingsCache;
        })
        .catch((err) => {
          publicSettingsPromise = null;
          throw err;
        });
    }
    return publicSettingsPromise;
  },
};

let bannersPromise: Promise<PublicBanner[]> | null = null;

export const bannersApi = {
  list: (position = 'hero') => {
    if (position === 'hero' && bannersPromise) return bannersPromise;
    const req = apiClient
      .get<{ success: boolean; banners: PublicBanner[] }>('/banners', { params: { position } })
      .then((r) => r.data.banners || []);
    if (position === 'hero') {
      bannersPromise = req.catch((err) => {
        bannersPromise = null;
        throw err;
      });
      return bannersPromise;
    }
    return req;
  },
};
