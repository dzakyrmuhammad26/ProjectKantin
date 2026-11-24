import dotenv from 'dotenv';
import app from './app.js';
import { initDatabase } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Inisialisasi Database
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 [Server] Berjalan pada port ${PORT} (http://localhost:${PORT})`);
    console.log(`📡 [Health] http://localhost:${PORT}/api/health`);
  });
};

startServer();
