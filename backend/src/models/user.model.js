import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    pin: {
      type: String,
      required: true,
      select: false,
    },
    peran: {
      type: String,
      enum: ['superadmin', 'kasir', 'gerai', 'pelanggan'],
      default: 'gerai',
    },
    idGerai: {
      type: String,
      default: null,
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

const UserModel = mongoose.model('users', schema)
export default UserModel
