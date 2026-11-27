import express from 'express'
import PembayaranController from '../controllers/pembayaran.controller.js'
import { authorizeRoles } from '../middlewares/auth.js'

const router = express.Router()

// GET terbuka tanpa JWT
router.get('/', PembayaranController.index)
router.get('/:id', PembayaranController.show)

// Write CRUD dilindungi JWT (via requireJwtExceptGet) + role superadmin / kasir
router.post('/', authorizeRoles('superadmin', 'kasir'), PembayaranController.proses)

export default router
