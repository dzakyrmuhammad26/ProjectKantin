import express from 'express'
import { requireJwtExceptGet } from '../middlewares/auth.js'
import { apiResponse } from '../utils/response.js'
import authRoutes from './auth.routes.js'
import geraiRoutes from './gerai.routes.js'
import laporanRoutes from './laporan.routes.js'
import menuRoutes from './menu.routes.js'
import pembayaranRoutes from './pembayaran.routes.js'
import pengaturanRoutes from './pengaturan.routes.js'
import penggunaRoutes from './pengguna.routes.js'
import pesananRoutes from './pesanan.routes.js'
import sesiRoutes from './sesi.routes.js'
import uploadRoutes from './upload.routes.js'

const router = express.Router()

router.get('/health', (req, res) => {
  return apiResponse({
    res,
    status: 200,
    message: 'Backend Kantin API is healthy and running',
    data: {
      timestamp: new Date().toISOString(),
    },
  })
})

// Auth routes (login & verify-pin publik; /me tetap memakai authenticateJwt)
router.use('/auth', authRoutes)

// Mekanisme JWT global untuk semua operasi CRUD (POST, PUT, PATCH, DELETE) kecuali GET
router.use(requireJwtExceptGet)

router.use('/pengguna', penggunaRoutes)
router.use('/gerai', geraiRoutes)
router.use('/menu', menuRoutes)
router.use('/sesi', sesiRoutes)
router.use('/pesanan', pesananRoutes)
router.use('/pembayaran', pembayaranRoutes)
router.use('/laporan', laporanRoutes)
router.use('/pengaturan', pengaturanRoutes)
router.use('/upload', uploadRoutes)

export default router
