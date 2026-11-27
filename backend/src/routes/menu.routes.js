import express from 'express'
import MenuController from '../controllers/menu.controller.js'
import { authorizeRoles } from '../middlewares/auth.js'

const router = express.Router()

// GET terbuka tanpa JWT
router.get('/', MenuController.index)
router.get('/gerai/:idGerai', MenuController.byGerai)
router.get('/:id', MenuController.show)

// Write CRUD dilindungi JWT (via requireJwtExceptGet) + role superadmin / gerai
router.post('/', authorizeRoles('superadmin', 'gerai'), MenuController.store)
router.put('/:id', authorizeRoles('superadmin', 'gerai'), MenuController.update)
router.patch('/:id', authorizeRoles('superadmin', 'gerai'), MenuController.update)
router.patch('/:id/toggle-habis', authorizeRoles('superadmin', 'gerai'), MenuController.toggleStatus)
router.delete('/:id', authorizeRoles('superadmin', 'gerai'), MenuController.delete)

export default router
