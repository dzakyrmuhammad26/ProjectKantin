import mongoose from 'mongoose'
import connectDB from '../config/database.js'
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
      await GeraiModel.findOneAndUpdate(
        { kode: gerai.kode },
        gerai,
        { upsert: true, returnDocument: 'after' },
      )
    }

    console.log('🌱 Seeding Pengguna...')
    for (const user of INITIAL_PENGGUNA) {
      const hashedPin = await PasswordHelper.hash(user.pin)
      await UserModel.findOneAndUpdate(
        { username: user.username },
        { ...user, pin: hashedPin },
        { upsert: true, returnDocument: 'after' },
      )
    }

    console.log('🌱 Seeding Menu...')
    for (const menu of INITIAL_MENU) {
      await MenuModel.findOneAndUpdate(
        { kode: menu.kode },
        menu,
        { upsert: true, returnDocument: 'after' },
      )
    }

    console.log('🌱 Seeding Pengaturan...')
    const existingPengaturan = await PengaturanModel.findOne()
    if (!existingPengaturan) {
      await PengaturanModel.create(INITIAL_PENGATURAN)
    }

    console.log('✅ Seeding database Kantin selesai!')
  } catch (error) {
    console.error('❌ Gagal menjalankan seeder:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
  }
}

seedDatabase()
