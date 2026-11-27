import express from 'express'
import AuthController from '../controllers/auth.controller.js'
import { authenticateJwt } from '../middlewares/auth.js'

const router = express.Router()

router.post('/login', AuthController.login)
router.post('/verify-pin', AuthController.login)
router.post('/guest', AuthController.guest)
router.get('/me', authenticateJwt, AuthController.me)

export default router
