import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    kode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    nama: {
      type: String,
      required: true,
      trim: true,
    },
    penyewa: {
      type: String,
      required: true,
      trim: true,
    },
    warna: {
      type: String,
      default: '#F97316',
      trim: true,
    },
    aktif: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

const GeraiModel = mongoose.model('gerai', schema)
export default GeraiModel
