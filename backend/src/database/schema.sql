-- ============================================================
-- SKEMA DATABASE SISTEM POS KANTIN SENTRAL (Clean Relational MVC)
-- Target RDBMS: MySQL 8.0+ / MariaDB 10.5+
-- ============================================================

CREATE DATABASE IF NOT EXISTS `kantin_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `kantin_db`;

-- 1. TABEL GERAI (STALL / TENANT)
CREATE TABLE IF NOT EXISTS `gerai` (
  `id` VARCHAR(10) PRIMARY KEY, -- 'G01', 'G02', dll.
  `kode` VARCHAR(10) NOT NULL UNIQUE,
  `nama` VARCHAR(100) NOT NULL,
  `penyewa` VARCHAR(100) NOT NULL,
  `warna` VARCHAR(10) NOT NULL DEFAULT '#F97316',
  `aktif` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. TABEL PENGGUNA (USERS & STAFF)
CREATE TABLE IF NOT EXISTS `pengguna` (
  `id` VARCHAR(50) PRIMARY KEY, -- 'USR-ADMIN-01', dll.
  `nama` VARCHAR(100) NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `pin` VARCHAR(6) NOT NULL, -- PIN numerik 4-6 digit
  `peran` ENUM('superadmin', 'kasir', 'gerai', 'pelanggan') NOT NULL DEFAULT 'gerai',
  `id_gerai` VARCHAR(10) NULL,
  `aktif` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_pengguna_gerai` FOREIGN KEY (`id_gerai`) REFERENCES `gerai` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 3. TABEL MENU MAKANAN & MINUMAN
CREATE TABLE IF NOT EXISTS `menu` (
  `id` VARCHAR(50) PRIMARY KEY, -- 'g01-001'
  `kode` VARCHAR(20) NOT NULL UNIQUE,
  `nama` VARCHAR(100) NOT NULL,
  `harga` INT UNSIGNED NOT NULL DEFAULT 0,
  `id_gerai` VARCHAR(10) NOT NULL,
  `nama_gerai` VARCHAR(100) NOT NULL,
  `kategori` ENUM('makanan', 'minuman', 'camilan') NOT NULL DEFAULT 'makanan',
  `foto` VARCHAR(255) NULL,
  `urutan` INT NOT NULL DEFAULT 99,
  `is_favorit` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_habis` BOOLEAN NOT NULL DEFAULT FALSE,
  `aktif` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_menu_gerai` (`id_gerai`),
  INDEX `idx_menu_kategori` (`kategori`),
  INDEX `idx_menu_status` (`aktif`, `is_habis`),
  CONSTRAINT `fk_menu_gerai` FOREIGN KEY (`id_gerai`) REFERENCES `gerai` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 4. TABEL SESI PELANGGAN (KARTU 1 - 99)
CREATE TABLE IF NOT EXISTS `sesi` (
  `id` VARCHAR(50) PRIMARY KEY, -- 'SESI-YYYYMMDD-XXXX'
  `nomor_kartu` TINYINT UNSIGNED NOT NULL, -- 1 s.d. 99
  `nomor_meja` SMALLINT UNSIGNED NULL,
  `status` ENUM('aktif', 'lunas', 'batal', 'tidak_dibayar') NOT NULL DEFAULT 'aktif',
  `total_tagihan` INT UNSIGNED NOT NULL DEFAULT 0,
  `waktu_buka` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `waktu_tutup` TIMESTAMP NULL DEFAULT NULL,
  INDEX `idx_sesi_kartu` (`nomor_kartu`),
  INDEX `idx_sesi_status` (`status`)
) ENGINE=InnoDB;

-- 5. TABEL PESANAN (HEADER ORDER / TRANSAKSI)
CREATE TABLE IF NOT EXISTS `pesanan` (
  `id` VARCHAR(50) PRIMARY KEY, -- 'TRX-1201'
  `id_sesi` VARCHAR(50) NULL,
  `nomor_kartu` VARCHAR(10) NOT NULL,
  `nomor_meja` SMALLINT UNSIGNED NULL,
  `id_gerai` VARCHAR(10) NULL,
  `nama_gerai` VARCHAR(100) NULL,
  `status` ENUM('menunggu_bayar', 'siap_dibuat', 'selesai', 'batal') NOT NULL DEFAULT 'menunggu_bayar',
  `sumber` ENUM('pelanggan', 'gerai', 'kasir') NOT NULL DEFAULT 'pelanggan',
  `total` INT UNSIGNED NOT NULL DEFAULT 0,
  `catatan` TEXT NULL,
  `waktu_pesan` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_pesanan_kartu` (`nomor_kartu`),
  INDEX `idx_pesanan_gerai` (`id_gerai`),
  INDEX `idx_pesanan_status` (`status`),
  CONSTRAINT `fk_pesanan_sesi` FOREIGN KEY (`id_sesi`) REFERENCES `sesi` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_pesanan_gerai` FOREIGN KEY (`id_gerai`) REFERENCES `gerai` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 6. TABEL ITEM DETAIL PESANAN
CREATE TABLE IF NOT EXISTS `item_pesanan` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `id_pesanan` VARCHAR(50) NOT NULL,
  `id_menu` VARCHAR(50) NOT NULL,
  `nama_menu` VARCHAR(100) NOT NULL,
  `harga_saat_itu` INT UNSIGNED NOT NULL,
  `jumlah` INT UNSIGNED NOT NULL DEFAULT 1,
  `subtotal` INT UNSIGNED NOT NULL,
  `catatan` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_item_pesanan` (`id_pesanan`),
  INDEX `idx_item_menu` (`id_menu`),
  CONSTRAINT `fk_item_pesanan` FOREIGN KEY (`id_pesanan`) REFERENCES `pesanan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_item_menu` FOREIGN KEY (`id_menu`) REFERENCES `menu` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 7. TABEL PEMBAYARAN DI KASIR SENTRAL
CREATE TABLE IF NOT EXISTS `pembayaran` (
  `id` VARCHAR(50) PRIMARY KEY,
  `id_pesanan` VARCHAR(50) NULL,
  `id_sesi` VARCHAR(50) NULL,
  `metode` ENUM('tunai', 'qris', 'debit', 'cash') NOT NULL DEFAULT 'tunai',
  `total_tagihan` INT UNSIGNED NOT NULL,
  `uang_diterima` INT UNSIGNED NOT NULL,
  `kembalian` INT UNSIGNED NOT NULL DEFAULT 0,
  `referensi_qris` VARCHAR(100) NULL,
  `id_kasir` VARCHAR(50) NULL,
  `waktu_bayar` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_bayar_pesanan` (`id_pesanan`),
  CONSTRAINT `fk_bayar_kasir` FOREIGN KEY (`id_kasir`) REFERENCES `pengguna` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 8. TABEL PENGATURAN KANTIN
CREATE TABLE IF NOT EXISTS `pengaturan` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `nama_kantin` VARCHAR(100) NOT NULL DEFAULT 'Kantin Sentral Pujasera',
  `alamat_kantin` VARCHAR(255) NOT NULL DEFAULT 'Gedung Kuliah Bersama Lt. 1',
  `nomor_kartu_min` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `nomor_kartu_max` TINYINT UNSIGNED NOT NULL DEFAULT 99,
  `teks_footer_struk` VARCHAR(255) NOT NULL DEFAULT 'Terima kasih atas kunjungan Anda!',
  `metode_bayar_aktif` JSON NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
