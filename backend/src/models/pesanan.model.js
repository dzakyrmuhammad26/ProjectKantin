import mongoose from 'mongoose'

const itemPesananSchema = new mongoose.Schema(
  {
    idMenu: {
      type: String,
      required: true,
    },
    namaMenu: {
      type: String,
      required: true,
    },
    hargaSaatItu: {
      type: Number,
      required: true,
    },
    jumlah: {
      type: Number,
      required: true,
      min: 1,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    catatan: {
      type: String,
      default: '',
    },
  },
  { _id: false },
)

const schema = new mongoose.Schema(
  {
    idPesanan: {
      type: String,
      unique: true,
      trim: true,
    },
    idSesi: {
      type: String,
      default: null,
      trim: true,
    },
    nomorKartu: {
      type: String,
      required: true,
      trim: true,
    },
    nomorMeja: {
      type: Number,
      default: null,
    },
    idGerai: {
      type: String,
      default: null,
      trim: true,
    },
    namaGerai: {
      type: String,
      default: null,
      trim: true,
    },
    status: {
      type: String,
      enum: ['menunggu_bayar', 'siap_dibuat', 'selesai', 'batal'],
      default: 'menunggu_bayar',
    },
    sumber: {
      type: String,
      enum: ['pelanggan', 'gerai', 'kasir'],
      default: 'pelanggan',
    },
    items: {
      type: [itemPesananSchema],
      required: true,
      validate: [(val) => val.length > 0, 'Pesanan minimal memiliki 1 item'],
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    catatan: {
      type: String,
      default: '',
    },
    waktuPesan: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

const PesananModel = mongoose.model('pesanan', schema)
export default PesananModel
