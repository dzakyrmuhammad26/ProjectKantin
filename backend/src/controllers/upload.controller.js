import { apiResponse } from '../utils/response.js'
import { deleteMenuImage, uploadMenuImage } from '../utils/storage.js'

class UploadController {
  static async uploadImage(req, res, next) {
    if (!req.file) {
      return apiResponse({
        res,
        status: 422,
        message: 'File gambar wajib diunggah (gunakan field "image")',
      })
    }

    try {
      const uploaded = await uploadMenuImage(req.file)
      return apiResponse({
        res,
        status: 201,
        message: 'Gambar berhasil diunggah',
        data: uploaded,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async deleteImage(req, res, next) {
    const publicId = req.body?.publicId || req.query?.publicId
    const provider = req.body?.provider || req.query?.provider || 'local'

    if (!publicId) {
      return apiResponse({
        res,
        status: 422,
        message: 'Parameter publicId wajib disertakan',
      })
    }

    try {
      const removed = await deleteMenuImage({ publicId, provider })
      if (!removed) {
        return apiResponse({
          res,
          status: 404,
          message: 'File gambar tidak ditemukan',
        })
      }

      return apiResponse({
        res,
        status: 200,
        message: 'Gambar berhasil dihapus',
      })
    } catch (error) {
      return next(error)
    }
  }
}

export default UploadController
