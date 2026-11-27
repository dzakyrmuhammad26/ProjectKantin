import jwt from 'jsonwebtoken'
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js'

export const generateToken = (payload, options = {}) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
        ...options,
      },
      (err, token) => {
        if (err) return reject(err)
        resolve(token)
      },
    )
  })
}

export const verifyToken = (token, options = {}) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, options, (err, decoded) => {
      if (err) return reject(err)
      resolve(decoded)
    })
  })
}

export class JwtHelper {
  static async sign(payload, options = {}) {
    return generateToken(payload, options)
  }

  static async verify(token, options = {}) {
    return verifyToken(token, options)
  }
}
