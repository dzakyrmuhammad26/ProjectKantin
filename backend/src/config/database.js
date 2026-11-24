import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import {
  INITIAL_GERAI,
  INITIAL_MENU,
  INITIAL_PENGGUNA,
  INITIAL_PENGATURAN,
} from './seedData.js';

dotenv.config();

let pool = null;
let isDbConnected = false;

// In-Memory store sebagai fallback saat database MySQL belum dinyalakan
export const memoryStore = {
  gerai: [...INITIAL_GERAI],
  menu: [...INITIAL_MENU],
  pengguna: [...INITIAL_PENGGUNA],
  pesanan: [],
  sesi: [],
  pembayaran: [],
  pengaturan: { ...INITIAL_PENGATURAN },
};

/**
 * Inisialisasi pool koneksi MySQL
 */
export const initDatabase = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'kantin_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    isDbConnected = true;
    console.log('✅ [Database] Berhasil terhubung ke database MySQL.');
  } catch (error) {
    isDbConnected = false;
    console.warn(
      '⚠️ [Database] Tidak dapat terhubung ke MySQL (' +
        error.message +
        '). Menggunakan In-Memory Mock Store untuk pengembangan lokal.'
    );
  }
};

export const getDb = () => pool;
export const isConnected = () => isDbConnected;
