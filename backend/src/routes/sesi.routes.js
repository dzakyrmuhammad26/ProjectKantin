import express from 'express'
import SesiController from '../controllers/sesi.controller.js'
import { authenticateJwt, authorizeRoles } from '../middlewares/auth.js'

const router = express.Router()

// List seluruh sesi khusus superadmin / kasir; cek aktif kartu & detail sesi tetap terbuka untuk kiosk
router.get('/', authenticateJwt, authorizeRoles('superadmin', 'kasir'), SesiController.index)
router.get('/aktif/:nomorKartu', SesiController.aktifByKartu)
router.get('/:id', SesiController.show)

// Write CRUD dilindungi JWT (via requireJwtExceptGet)
router.post('/buka', SesiController.buka)
router.patch('/:id/tutup', authorizeRoles('superadmin', 'kasir'), SesiController.tutup)
router.patch('/:id/status', authorizeRoles('superadmin', 'kasir'), SesiController.updateStatus)

export default router
