import express from 'express'
import PenggunaController from '../controllers/pengguna.controller.js'
import { authenticateJwt, authorizeRoles } from '../middlewares/auth.js'

const router = express.Router()

// Seluruh operasi pengguna (termasuk GET daftar & detail staf) khusus superadmin
router.use(authenticateJwt, authorizeRoles('superadmin'))

router.get('/', PenggunaController.index)
router.get('/:id', PenggunaController.show)
router.post('/', PenggunaController.store)
router.put('/:id', PenggunaController.update)
router.patch('/:id', PenggunaController.update)
router.patch('/:id/pin', PenggunaController.ubahPin)
router.delete('/:id', PenggunaController.delete)

export default router
