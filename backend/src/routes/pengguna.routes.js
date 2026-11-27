import express from 'express'
import PenggunaController from '../controllers/pengguna.controller.js'
import { authorizeRoles } from '../middlewares/auth.js'

const router = express.Router()

// GET terbuka tanpa JWT
router.get('/', PenggunaController.index)
router.get('/:id', PenggunaController.show)

// Write CRUD dilindungi JWT (via requireJwtExceptGet) + role superadmin
router.post('/', authorizeRoles('superadmin'), PenggunaController.store)
router.put('/:id', authorizeRoles('superadmin'), PenggunaController.update)
router.patch('/:id', authorizeRoles('superadmin'), PenggunaController.update)
router.patch('/:id/pin', authorizeRoles('superadmin'), PenggunaController.ubahPin)
router.delete('/:id', authorizeRoles('superadmin'), PenggunaController.delete)

export default router
