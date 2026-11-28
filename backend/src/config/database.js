import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const connectDB = async () => {
  try {
    await prisma.$connect()
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ MySQL (Prisma) connected successfully')
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message)
    process.exit(1)
  }
}

export { prisma }
export default prisma
