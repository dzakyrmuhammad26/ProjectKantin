import express from 'express'
import SesiController from '../controllers/sesi.controller.js'
import { authorizeRoles } from '../middlewares/auth.js'

const router = express.Router()

// GET terbuka tanpa JWT
router.get('/', SesiController.index)
router.get('/aktif/:nomorKartu', SesiController.aktifByKartu)
router.get('/:id', SesiController.show)

// Write CRUD dilindungi JWT (via requireJwtExceptGet)
router.post('/buka', SesiController.buka)
router.patch('/:id/tutup', authorizeRoles('superadmin', 'kasir'), SesiController.tutup)
router.patch('/:id/status', authorizeRoles('superadmin', 'kasir'), SesiController.updateStatus)

export default router
