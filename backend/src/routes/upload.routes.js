import express from 'express'
import UploadController from '../controllers/upload.controller.js'
import { authorizeRoles } from '../middlewares/auth.js'
import { uploadSingleImage } from '../middlewares/upload.js'

const router = express.Router()

// Dilindungi JWT (via requireJwtExceptGet) + role superadmin / gerai
router.post('/', authorizeRoles('superadmin', 'gerai'), uploadSingleImage, UploadController.uploadImage)
router.delete('/', authorizeRoles('superadmin', 'gerai'), UploadController.deleteImage)

export default router
