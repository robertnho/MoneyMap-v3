// backend/src/lib/jwt.js
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'dev-secret'
const EXPIRES_IN = '7d'

export function signToken (payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN })
}

export function verifyToken (token) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}
