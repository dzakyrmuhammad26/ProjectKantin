import express from 'express'
import PesananController from '../controllers/pesanan.controller.js'
import { authorizeRoles } from '../middlewares/auth.js'

const router = express.Router()

// GET terbuka tanpa JWT
router.get('/', PesananController.index)
router.get('/kartu/:nomorKartu', PesananController.byKartu)
router.get('/gerai/:idGerai', PesananController.byGerai)
router.get('/sesi/:idSesi', PesananController.bySesi)
router.get('/:id', PesananController.show)

// Write CRUD dilindungi JWT (via requireJwtExceptGet)
router.post('/', PesananController.store)
router.patch('/:id/status', authorizeRoles('superadmin', 'kasir', 'gerai'), PesananController.updateStatus)
router.put('/:id/items', authorizeRoles('superadmin', 'kasir'), PesananController.updateItems)
router.patch('/:id/batal', authorizeRoles('superadmin', 'kasir', 'gerai'), PesananController.batal)

export default router
