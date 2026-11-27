import PengaturanModel from '../models/pengaturan.model.js'
import { updatePengaturanSchema } from '../schemas/pengaturanSchema.js'
import { apiResponse, apiResponseValidation } from '../utils/response.js'

class PengaturanController {
  static async index(req, res, next) {
    try {
      let pengaturan = await PengaturanModel.findOne()
      if (!pengaturan) {
        pengaturan = await PengaturanModel.create({})
      }

      return apiResponse({
        res,
        status: 200,
        message: 'Pengaturan sistem kantin',
        data: pengaturan,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async update(req, res, next) {
    const result = updatePengaturanSchema.safeParse(req.body)
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    try {
      let pengaturan = await PengaturanModel.findOne()
      if (!pengaturan) {
        pengaturan = await PengaturanModel.create(result.data)
      } else {
        pengaturan = await PengaturanModel.findByIdAndUpdate(
          pengaturan._id,
          result.data,
          { returnDocument: 'after', runValidators: true },
        )
      }

      return apiResponse({
        res,
        status: 200,
        message: 'Pengaturan sistem berhasil diperbarui',
        data: pengaturan,
      })
    } catch (error) {
      return next(error)
    }
  }
}

export default PengaturanController
