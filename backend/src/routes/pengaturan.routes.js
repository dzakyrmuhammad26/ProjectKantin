import express from 'express'
import PengaturanController from '../controllers/pengaturan.controller.js'
import { authorizeRoles } from '../middlewares/auth.js'

const router = express.Router()

// GET terbuka tanpa JWT
router.get('/', PengaturanController.index)

// Write CRUD dilindungi JWT (via requireJwtExceptGet) + role superadmin
router.put('/', authorizeRoles('superadmin'), PengaturanController.update)
router.patch('/', authorizeRoles('superadmin'), PengaturanController.update)

export default router
