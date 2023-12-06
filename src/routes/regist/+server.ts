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

  if (challenge === null) {
    return Response.json({
      success: false,
      message: 'Registration timed out.'
    })
  }

  const verification = await verifyRegistrationResponse({
    response: registration,
    expectedChallenge: challenge,
    expectedOrigin: 'https://' + url.host, // https enforced
    expectedRPID: url.host,
    requireUserVerification: true
  }).catch(() => undefined)

  if (verification?.verified !== true || verification.registrationInfo === undefined) {
    return Response.json({
      success: false,
      message: 'Verification failed.'
    })
  }

  const auth = await db.auth.findUnique({
    where: {
      authenticatorId: registration.id
    }
  })

  if (auth !== null) {
    return Response.json({
      success: false,
      message: 'You already have an account. Did you mean login?'
    })
  }

  await db.user.create({
    data: {
      userID,
      userName
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
      authenticatorId: registration.id,
      credentialPublicKey: Buffer.from(credentialPublicKey),
      credentialID: Buffer.from(credentialID),
      counter,
      credentialDeviceType,
      credentialBackedUp,
      transports: registration.response.transports?.join(',') ?? '',
      userID
    }
  })

  return Response.json({
    success: true
  })
}
