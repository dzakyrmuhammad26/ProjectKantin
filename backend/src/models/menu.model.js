import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    kode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    nama: {
      type: String,
      required: true,
      trim: true,
    },
    harga: {
      type: Number,
      required: true,
      min: 0,
    },
    idGerai: {
      type: String,
      required: true,
      trim: true,
    },
    namaGerai: {
      type: String,
      required: true,
      trim: true,
    },
    kategori: {
      type: String,
      enum: ['makanan', 'minuman', 'camilan'],
      default: 'makanan',
    },
    foto: {
      type: String,
      default: '/images/menu/placeholder.jpg',
    },
    urutan: {
      type: Number,
      default: 99,
    },
    isFavorit: {
      type: Boolean,
      default: false,
    },
    isHabis: {
      type: Boolean,
      default: false,
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

const MenuModel = mongoose.model('menus', schema)
export default MenuModel
