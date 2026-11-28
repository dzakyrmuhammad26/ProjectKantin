import express from 'express'
import PembayaranController from '../controllers/pembayaran.controller.js'
import { authenticateJwt, authorizeRoles } from '../middlewares/auth.js'

const router = express.Router()

// Riwayat & proses pembayaran khusus superadmin dan kasir
router.use(authenticateJwt, authorizeRoles('superadmin', 'kasir'))

router.get('/', PembayaranController.index)
router.get('/:id', PembayaranController.show)
router.post('/', PembayaranController.proses)

export default router
