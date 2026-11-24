import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    namaKantin: {
      type: String,
      default: 'Kantin Sentral Pujasera',
      trim: true,
    },
    alamatKantin: {
      type: String,
      default: 'Gedung Kuliah Bersama Lt. 1',
      trim: true,
    },
    nomorKartuMin: {
      type: Number,
      default: 1,
    },
    nomorKartuMax: {
      type: Number,
      default: 99,
    },
    teksFooterStruk: {
      type: String,
      default: 'Terima kasih atas kunjungan Anda di Kantin Sentral!',
    },
    metodeBayarAktif: {
      type: [String],
      default: ['tunai', 'qris', 'debit'],
    },
  },
  {
    timestamps: true,
  },
)

const PengaturanModel = mongoose.model('pengaturan', schema)
export default PengaturanModel
