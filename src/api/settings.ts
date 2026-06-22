import apiClient from './client';

/** Public site settings keyed by their setting name (tax, shipping, contact, etc.). */
export type PublicSettings = Record<string, unknown>;

export const settingsApi = {
  public: () =>
    apiClient
      .get<{ success: boolean; settings: PublicSettings }>('/settings/public')
      .then((r) => r.data.settings || {}),
};
