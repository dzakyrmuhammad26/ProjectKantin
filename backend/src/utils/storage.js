import crypto from 'crypto'
import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { v2 as cloudinary } from 'cloudinary'
import {
  APP_URL,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from '../config/env.js'
import { AppError } from './appError.js'

const LOCAL_MENU_UPLOAD_DIR = path.resolve('uploads', 'menu')

const isCloudinaryConfigured = () => {
  return Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET)
}

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  })
}

const convertToWebp = async (buffer) => {
  try {
    return await sharp(buffer)
      .rotate()
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer()
  } catch {
    throw new AppError('File gambar tidak valid atau rusak', 400)
  }
}

const uploadBufferToCloudinary = (buffer, originalName) => {
  configureCloudinary()
  const baseName = path
    .basename(originalName || 'menu', path.extname(originalName || ''))
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 30)

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'kantin-sentral/menu',
        public_id: `${baseName || 'menu'}-${Date.now()}`,
        resource_type: 'image',
        format: 'webp',
      },
      (error, result) => {
        if (error) return reject(error)
        return resolve(result)
      },
    )
    stream.end(buffer)
  })
}

const uploadBufferLocally = async (webpBuffer) => {
  await fs.mkdir(LOCAL_MENU_UPLOAD_DIR, { recursive: true })

  const safeFilename = `menu-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.webp`
  const targetPath = path.join(LOCAL_MENU_UPLOAD_DIR, safeFilename)

  await fs.writeFile(targetPath, webpBuffer)

  const baseUrl = APP_URL.replace(/\/+$/, '')
  return {
    url: `${baseUrl}/uploads/menu/${safeFilename}`,
    publicId: safeFilename,
    provider: 'local',
  }
}

/**
 * Mengonversi gambar ke format WebP (maks. lebar 800px, quality 80) lalu menyimpannya
 * ke Cloudinary jika terkonfigurasi, atau fallback ke folder lokal uploads/menu.
 */
export const uploadMenuImage = async (file) => {
  const webpBuffer = await convertToWebp(file.buffer)

  if (isCloudinaryConfigured()) {
    const result = await uploadBufferToCloudinary(webpBuffer, file.originalname)
    return {
      url: result.secure_url,
      publicId: result.public_id,
      provider: 'cloudinary',
      size: webpBuffer.length,
      mimeType: 'image/webp',
    }
  }

  const localResult = await uploadBufferLocally(webpBuffer)
  return {
    ...localResult,
    size: webpBuffer.length,
    mimeType: 'image/webp',
  }
}

/**
 * Menghapus gambar berdasarkan publicId/nama file.
 */
export const deleteMenuImage = async ({ publicId, provider } = {}) => {
  if (!publicId) return false

  if (provider === 'cloudinary' && isCloudinaryConfigured()) {
    configureCloudinary()
    await cloudinary.uploader.destroy(publicId)
    return true
  }

  const safeName = path.basename(publicId)
  const targetPath = path.join(LOCAL_MENU_UPLOAD_DIR, safeName)
  try {
    await fs.unlink(targetPath)
    return true
  } catch (error) {
    if (error.code === 'ENOENT') return false
    throw error
  }
}

/**
 * Menghapus file gambar hasil upload berdasarkan URL tersimpan di database.
 * Aman dipanggil untuk URL statis/placeholder (diabaikan tanpa error).
 */
export const deleteImageByUrl = async (url) => {
  if (!url || typeof url !== 'string') return false

  if (url.includes('/uploads/menu/')) {
    const filename = path.basename(url.split('?')[0])
    return await deleteMenuImage({ publicId: filename, provider: 'local' })
  }

  if (url.includes('res.cloudinary.com') && isCloudinaryConfigured()) {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i)
    if (match?.[1]) {
      return await deleteMenuImage({ publicId: match[1], provider: 'cloudinary' })
    }
  }

  return false
}
