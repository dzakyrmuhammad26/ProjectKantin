import express from 'express'
import LaporanController from '../controllers/laporan.controller.js'
import { authenticateJwt, authorizeRoles } from '../middlewares/auth.js'

const router = express.Router()

// Laporan omzet & rekap operasional khusus superadmin / owner
router.use(authenticateJwt, authorizeRoles('superadmin'))

router.get('/rekap-gerai', LaporanController.rekapGerai)
router.get('/ringkasan', LaporanController.ringkasan)

export default router
