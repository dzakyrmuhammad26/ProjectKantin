import app from './app.js'
import { connectDB } from './config/database.js'
import { APP_PORT } from './config/env.js'

const startServer = async () => {
  await connectDB()

  app.listen(APP_PORT, () => {
    console.log(`🚀 [Server] Berjalan pada port ${APP_PORT} (http://localhost:${APP_PORT})`)
    console.log(`📡 [Health] http://localhost:${APP_PORT}/api/health`)
  })
}

startServer()
