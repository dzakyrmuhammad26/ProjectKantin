import bcrypt from 'bcryptjs'

export class PasswordHelper {
  static async hash(password, saltRounds = 10) {
    return await bcrypt.hash(password, saltRounds)
  }

  static async compare(password, hash) {
    return await bcrypt.compare(password, hash)
  }
}
