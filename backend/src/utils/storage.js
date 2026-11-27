import crypto from 'crypto'
import fs from 'fs/promises'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'
import {
  APP_URL,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from '../config/env.js'

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
        transformation: [
          {
            width: 800,
            crop: 'limit',
            quality: 'auto',
            fetch_format: 'auto',
          },
        ],
      },
      (error, result) => {
        if (error) return reject(error)
        return resolve(result)
      },
    )
    stream.end(buffer)
  })
}

const uploadBufferLocally = async (buffer, originalName, mimeType) => {
  await fs.mkdir(LOCAL_MENU_UPLOAD_DIR, { recursive: true })

  const extFromMime = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
  }[mimeType]

  const ext = extFromMime || path.extname(originalName || '').toLowerCase() || '.jpg'
  const safeFilename = `menu-${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`
  const targetPath = path.join(LOCAL_MENU_UPLOAD_DIR, safeFilename)

  await fs.writeFile(targetPath, buffer)

  const baseUrl = APP_URL.replace(/\/+$/, '')
  return {
    url: `${baseUrl}/uploads/menu/${safeFilename}`,
    publicId: safeFilename,
    provider: 'local',
  }
}

/**
 * Mengunggah gambar menu ke Cloudinary jika terkonfigurasi,
 * atau fallback otomatis ke folder lokal uploads/menu.
 */
export const uploadMenuImage = async (file) => {
  if (isCloudinaryConfigured()) {
    const result = await uploadBufferToCloudinary(file.buffer, file.originalname)
    return {
      url: result.secure_url,
      publicId: result.public_id,
      provider: 'cloudinary',
      size: file.size,
      mimeType: file.mimetype,
    }
  }

  const localResult = await uploadBufferLocally(file.buffer, file.originalname, file.mimetype)
  return {
    ...localResult,
    size: file.size,
    mimeType: file.mimetype,
  }
}

/**
 * Menghapus gambar berdasarkan publicId/nama file atau URL.
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
