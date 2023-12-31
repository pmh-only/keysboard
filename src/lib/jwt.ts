import jwt from 'jsonwebtoken'
import { env } from '$env/dynamic/private'

const JWT_SECRET = env.JWT_SECRET ?? 'youshallnotpass'

export const signToken = (userID: string): string =>
  jwt.sign({ userID }, JWT_SECRET)

export const verifyToken = (token: string): string | undefined => {
  try {
    return (jwt.verify(token, JWT_SECRET) as jwt.JwtPayload).userID
  } catch {
    return undefined
  }
}

export default {
  signToken,
  verifyToken
}
