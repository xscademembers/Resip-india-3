import apiClient from './client';

export interface ContactInquiry {
  name: string;
  email: string;
  company?: string;
  orderType?: string;
  message: string;
}

export const contactApi = {
  send: (data: ContactInquiry) =>
    apiClient
      .post<{ success: boolean; message: string }>('/contact', data)
      .then((r) => r.data),
};
