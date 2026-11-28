import express from 'express'
import PesananController from '../controllers/pesanan.controller.js'
import { authenticateJwt, authorizeRoles } from '../middlewares/auth.js'

const router = express.Router()

// Operasional list & antrean dapur dilindungi JWT; pelacakan per kartu/sesi/id tetap bisa untuk pelanggan
router.get('/', authenticateJwt, authorizeRoles('superadmin', 'kasir', 'gerai'), PesananController.index)
router.get('/kartu/:nomorKartu', PesananController.byKartu)
router.get('/gerai/:idGerai', authenticateJwt, authorizeRoles('superadmin', 'gerai'), PesananController.byGerai)
router.get('/sesi/:idSesi', PesananController.bySesi)
router.get('/:id', PesananController.show)

// Write CRUD dilindungi JWT (via requireJwtExceptGet)
router.post('/', PesananController.store)
router.patch('/:id/status', authorizeRoles('superadmin', 'kasir', 'gerai'), PesananController.updateStatus)
router.patch(
  '/:id/items/:itemId/status',
  authorizeRoles('superadmin', 'kasir', 'gerai'),
  PesananController.updateItemStatus,
)
router.put('/:id/items', authorizeRoles('superadmin', 'kasir'), PesananController.updateItems)
router.patch('/:id/batal', authorizeRoles('superadmin', 'kasir', 'gerai'), PesananController.batal)

export default router
