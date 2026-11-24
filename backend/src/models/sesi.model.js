import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    idSesi: {
      type: String,
      unique: true,
      trim: true,
    },
    nomorKartu: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
    },
    nomorMeja: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['aktif', 'lunas', 'batal', 'tidak_dibayar'],
      default: 'aktif',
    },
    totalTagihan: {
      type: Number,
      default: 0,
    },
    waktuBuka: {
      type: Date,
      default: Date.now,
    },
    waktuTutup: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

const SesiModel = mongoose.model('sesi', schema)
export default SesiModel
