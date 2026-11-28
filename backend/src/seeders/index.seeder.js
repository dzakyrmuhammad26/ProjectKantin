import { connectDB, prisma } from '../config/database.js'
import {
  INITIAL_GERAI,
  INITIAL_MENU,
  INITIAL_PENGATURAN,
  INITIAL_PENGGUNA,
} from '../config/seedData.js'
import GeraiModel from '../models/gerai.model.js'
import MenuModel from '../models/menu.model.js'
import PengaturanModel from '../models/pengaturan.model.js'
import UserModel from '../models/user.model.js'
import { PasswordHelper } from '../utils/bcrypt.js'

const seedDatabase = async () => {
  try {
    await connectDB()

    console.log('🌱 Seeding Gerai...')
    for (const gerai of INITIAL_GERAI) {
      await GeraiModel.upsert({
        where: { kode: gerai.kode },
        update: gerai,
        create: gerai,
      })
    }

    console.log('🌱 Seeding Pengguna...')
    for (const user of INITIAL_PENGGUNA) {
      const hashedPin = await PasswordHelper.hash(user.pin)
      await UserModel.upsert({
        where: { username: user.username },
        update: { ...user, pin: hashedPin },
        create: { ...user, pin: hashedPin },
      })
    }

    console.log('🌱 Seeding Menu...')
    for (const menu of INITIAL_MENU) {
      await MenuModel.upsert({
        where: { kode: menu.kode },
        update: menu,
        create: menu,
      })
    }

    console.log('🌱 Seeding Pengaturan...')
    const existingPengaturan = await PengaturanModel.findFirst()
    if (!existingPengaturan) {
      await PengaturanModel.create({
        data: INITIAL_PENGATURAN,
      })
    }

    console.log('✅ Seeding database MySQL Kantin selesai!')
  } catch (error) {
    console.error('❌ Gagal menjalankan seeder:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()
