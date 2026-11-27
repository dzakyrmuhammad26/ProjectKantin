import cors from 'cors'
import express from 'express'
import path from 'path'
import { FRONTEND_URL } from './config/env.js'
import { errorHandler, notFoundHandler } from './middlewares/error.js'
import apiRoutes from './routes/api.routes.js'

const app = express()

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.resolve('uploads')))

app.use('/api', apiRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
