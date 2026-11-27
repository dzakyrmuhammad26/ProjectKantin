import { apiRequest } from './httpClient';

export interface UploadImageResult {
  url: string;
  publicId: string;
  provider: 'cloudinary' | 'local';
  size: number;
  mimeType: string;
}

export const uploadApi = {
  async uploadMenuImage(file: File): Promise<UploadImageResult> {
    const formData = new FormData();
    formData.append('image', file);

    return await apiRequest<UploadImageResult>('/upload', {
      method: 'POST',
      body: formData,
    });
  },
};
