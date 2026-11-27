import multer from 'multer'
import path from 'path'
import { UPLOAD_MAX_SIZE_MB } from '../config/env.js'
import { AppError } from '../utils/appError.js'

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || '').toLowerCase()
  const isValidMime = ALLOWED_MIME_TYPES.has(file.mimetype)
  const isValidExt = ALLOWED_EXTENSIONS.has(ext)

  if (!isValidMime || !isValidExt) {
    return cb(
      new AppError(
        'Format file tidak didukung. Gunakan gambar JPG, JPEG, PNG, atau WEBP',
        400,
      ),
    )
  }

  return cb(null, true)
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: UPLOAD_MAX_SIZE_MB * 1024 * 1024,
  },
})

export const uploadSingleImage = upload.single('image')
