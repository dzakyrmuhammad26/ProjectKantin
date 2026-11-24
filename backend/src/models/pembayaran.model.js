import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    idPesanan: {
      type: String,
      required: true,
      trim: true,
    },
    idSesi: {
      type: String,
      default: null,
      trim: true,
    },
    metode: {
      type: String,
      enum: ['tunai', 'qris', 'debit', 'cash'],
      default: 'tunai',
    },
    totalTagihan: {
      type: Number,
      required: true,
    },
    uangDiterima: {
      type: Number,
      required: true,
    },
    kembalian: {
      type: Number,
      default: 0,
    },
    referensiQris: {
      type: String,
      default: null,
    },
    idKasir: {
      type: String,
      default: null,
    },
    waktuBayar: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

const PembayaranModel = mongoose.model('pembayaran', schema)
export default PembayaranModel
