import 'dotenv/config'

export const APP_PORT = process.env.APP_PORT ?? process.env.PORT ?? '5000'
export const DATABASE_URL = process.env.DATABASE_URL ?? 'mongodb://127.0.0.1:27017/kantin_db'
export const JWT_SECRET = process.env.JWT_SECRET ?? 'kantin-sentral-supersecret'
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1d'
export const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000'
