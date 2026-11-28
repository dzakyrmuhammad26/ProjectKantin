'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { MENU_IMAGE_FALLBACK } from '@/utils/formatters';

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface MenuImageUploadFieldProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
}

export function MenuImageUploadField({
  imageUrl,
  onImageUrlChange,
  selectedFile,
  onFileSelect,
}: MenuImageUploadFieldProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setObjectUrl(null);
      return;
    }

    const preview = URL.createObjectURL(selectedFile);
    setObjectUrl(preview);
    return () => URL.revokeObjectURL(preview);
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setFileError('Format gambar harus JPG, PNG, atau WEBP.');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError('Ukuran gambar maksimal 2 MB.');
      e.target.value = '';
      return;
    }

    setFileError(null);
    onFileSelect(file);
  };

  const handleClearFile = () => {
    setFileError(null);
    onFileSelect(null);
  };

  const normalizedUrl =
    !imageUrl || imageUrl === '/images/menu/placeholder.jpg' ? '' : imageUrl;
  const previewSrc = objectUrl || normalizedUrl || MENU_IMAGE_FALLBACK;

  return (
    <div className="flex flex-col gap-2">
      <label className="block font-medium text-[#374151]">Foto Menu</label>

      <div className="flex items-center gap-3 p-2.5 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB]">
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 border border-[#E5E7EB]">
          <img
            src={previewSrc}
            alt="Preview menu"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = MENU_IMAGE_FALLBACK;
            }}
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <label className="cursor-pointer px-2.5 py-1 rounded bg-white border border-[#D1D5DB] hover:bg-[#F3F4F6] text-xs font-medium text-[#374151]">
              {selectedFile ? 'Ganti File' : 'Pilih Gambar'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {selectedFile && (
              <button
                type="button"
                onClick={handleClearFile}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium"
              >
                Batalkan file
              </button>
            )}
          </div>

          <p className="text-[11px] text-[#6B7280] truncate">
            {selectedFile
              ? `Siap diunggah saat simpan: ${selectedFile.name}`
              : 'JPG, PNG, WEBP (maks. 2 MB)'}
          </p>
        </div>
      </div>

      {fileError && <p className="text-xs text-rose-600 font-medium">{fileError}</p>}

      {!selectedFile && (
        <input
          type="text"
          value={normalizedUrl}
          onChange={(e) => onImageUrlChange(e.target.value)}
          placeholder="Atau isi URL / path foto (opsional)"
          className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg text-xs text-[#4B5563] focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      )}
    </div>
  );
}
