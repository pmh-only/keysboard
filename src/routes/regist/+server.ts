import type { RequestHandler } from '@sveltejs/kit'
import type { RegistrationResponseJSON } from '@simplewebauthn/typescript-types'
import redis from '$lib/redis'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import db from '$lib/db'

interface Body {
  userID: string

  userName: string

  registration: RegistrationResponseJSON
}

export const POST: RequestHandler = async ({ request, url }) => {
  const { userID, userName, registration } = await request.json() as Body
  const challenge = await redis.get(userID)

  if (challenge === undefined) {
    return Response.json({
      success: false,
      message: 'Registration timed out.'
    })
  }

  const verification = await verifyRegistrationResponse({
    response: registration,
    expectedChallenge: challenge,
    expectedOrigin: 'https://' + url.host, // https enforced
    expectedRPID: url.host
  }).catch(() => undefined)

  if (verification?.verified !== true || verification.registrationInfo === undefined) {
    return Response.json({
      success: false,
      message: 'Verification failed.'
    })
  }

  const newUser = await db.user.create({
    data: {
      login: userID,
      nickname: userName
    }
  })

  const {
    credentialPublicKey,
    credentialID,
    counter,
    credentialDeviceType,
    credentialBackedUp
  } = verification.registrationInfo

  await db.auth.create({
    data: {
      credentialPublicKey,
      credentialID,
      counter,
      credentialDeviceType,
      credentialBackedUp,
      transports: registration.response.transports?.join(',') ?? '',
      userId: newUser.id
    }
  })

  return Response.json({
    success: true
  })
}
