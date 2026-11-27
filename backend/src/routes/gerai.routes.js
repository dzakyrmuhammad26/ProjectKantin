import express from 'express'
import GeraiController from '../controllers/gerai.controller.js'
import { authorizeRoles } from '../middlewares/auth.js'

const router = express.Router()

// GET terbuka tanpa JWT
router.get('/', GeraiController.index)
router.get('/:id', GeraiController.show)

// Write CRUD dilindungi JWT (via requireJwtExceptGet) + role superadmin
router.post('/', authorizeRoles('superadmin'), GeraiController.store)
router.put('/:id', authorizeRoles('superadmin'), GeraiController.update)
router.patch('/:id', authorizeRoles('superadmin'), GeraiController.update)
router.delete('/:id', authorizeRoles('superadmin'), GeraiController.delete)

export default router
