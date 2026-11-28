import { Pengguna } from '@/models/pengguna';
import { storage } from '@/services/storage';
import { apiRequest, getAuthToken, setAuthToken } from './httpClient';
import { mapPengguna } from './mappers';

export const penggunaApi = {
  async dapatkanSemua(onlyActive = true): Promise<Pengguna[]> {
    const query = onlyActive ? '?aktif=true' : '';
    const list = await apiRequest<any[]>(`/pengguna${query}`);
    return list.map(mapPengguna);
  },

  async dapatkanBerdasarkanId(id: string): Promise<Pengguna | null> {
    try {
      const data = await apiRequest<any>(`/pengguna/${encodeURIComponent(id)}`);
      return data ? mapPengguna(data) : null;
    } catch {
      return null;
    }
  },

  async verifikasiPin(pin: string, username?: string): Promise<Pengguna | null> {
    const body: Record<string, string> = { pin: pin.trim() };
    if (username?.trim()) {
      body.username = username.trim().toLowerCase();
    }

    const data = await apiRequest<{ user: any; access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (!data?.user || !data?.access_token) {
      return null;
    }

    setAuthToken(data.access_token);
    const user = mapPengguna(data.user);
    storage.setCurrentUser(user);
    return user;
  },

  async buatPengguna(data: Omit<Pengguna, 'id'>): Promise<Pengguna> {
    const created = await apiRequest<any>('/pengguna', {
      method: 'POST',
      body: JSON.stringify({
        nama: data.nama,
        username: data.username,
        pin: data.pin,
        peran: data.peran,
        idGerai: data.peran === 'gerai' ? data.idGerai || null : null,
        aktif: data.aktif !== false,
      }),
    });
    return mapPengguna(created);
  },

  async perbaruiPengguna(id: string, updates: Partial<Pengguna>): Promise<Pengguna> {
    const payload: Record<string, any> = {};
    if (updates.nama !== undefined) payload.nama = updates.nama;
    if (updates.username !== undefined) payload.username = updates.username;
    if (updates.pin !== undefined) payload.pin = updates.pin;
    if (updates.peran !== undefined) payload.peran = updates.peran;
    if (updates.idGerai !== undefined) payload.idGerai = updates.idGerai;
    if (updates.aktif !== undefined) payload.aktif = updates.aktif;

    const updated = await apiRequest<any>(`/pengguna/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return mapPengguna(updated);
  },

  async ubahPin(id: string, pinBaru: string): Promise<boolean> {
    await apiRequest(`/pengguna/${encodeURIComponent(id)}/pin`, {
      method: 'PATCH',
      body: JSON.stringify({ pinBaru: pinBaru.trim() }),
    });
    return true;
  },

  async hapusPengguna(id: string, permanent = false): Promise<boolean> {
    const query = permanent ? '?permanent=true' : '';
    await apiRequest(`/pengguna/${encodeURIComponent(id)}${query}`, {
      method: 'DELETE',
    });
    return true;
  },

  async getSession(): Promise<Pengguna | null> {
    const token = getAuthToken();
    if (!token) {
      return null;
    }

    try {
      const userRaw = await apiRequest<any>('/auth/me');
      const user = mapPengguna(userRaw);
      storage.setCurrentUser(user);
      return user;
    } catch {
      setAuthToken(null);
      storage.setCurrentUser(null);
      return null;
    }
  },

  async setSession(user: Pengguna | null): Promise<void> {
    if (!user) {
      setAuthToken(null);
    }
    storage.setCurrentUser(user);
  },
};
