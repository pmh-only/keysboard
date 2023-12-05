import type { RequestHandler } from '@sveltejs/kit'
import type { AuthenticationResponseJSON, AuthenticatorTransportFuture } from '@simplewebauthn/typescript-types'
import redis from '$lib/redis'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import db from '$lib/db'
import jwt from '$lib/jwt'
import type { Auth } from '@prisma/client'

interface Body {
  authID: string

  authentication: AuthenticationResponseJSON
}

export const POST: RequestHandler = async ({ request, url }) => {
  const { authID, authentication } = await request.json() as Body
  const challenge = await redis.get(authID)

  if (challenge === null) {
    return Response.json({
      success: false,
      message: 'Authentication timed out.'
    })
  }

  const credentialID = authentication.id
    .replaceAll('-', '+')
    .replaceAll('_', '/') +
    '='.repeat(authentication.id.length % 4)

  const [auth]: Auth[] =
    await db.$queryRaw`SELECT * FROM Auth WHERE credentialID = FROM_BASE64(${credentialID}) LIMIT 1` ?? []

  if (auth === undefined) {
    return Response.json({
      success: false,
      message: 'User not found. Please use another passkey.'
    })
  }

  const verification = await verifyAuthenticationResponse({
    response: authentication,
    expectedChallenge: challenge,
    expectedOrigin: 'https://' + url.host, // https enforced
    expectedRPID: url.host,
    authenticator: {
      ...auth,
      transports: auth.transports.split(',') as AuthenticatorTransportFuture[]
    }
  }).catch(() => undefined)

  if (verification?.verified !== true) {
    return Response.json({
      success: false,
      message: 'Verification failed.'
    })
  }

  const sessionToken = jwt.signToken(auth.userID)
  const response = Response.json({
    success: true
  })

  response.headers.set('Set-Cookie', `SESSION_TOKEN=${sessionToken}; Path=/; Secure; HttpOnly; Max-Age=${7 * 24 * 60 * 60}`) // expire after 7 days

  return response
}
