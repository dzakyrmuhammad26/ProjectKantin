import express from 'express'
import LaporanController from '../controllers/laporan.controller.js'

const router = express.Router()

// GET terbuka tanpa JWT
router.get('/rekap-gerai', LaporanController.rekapGerai)
router.get('/ringkasan', LaporanController.ringkasan)

export default router
