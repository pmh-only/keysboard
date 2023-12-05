import { v4 as uuid } from 'uuid'
import type { Actions } from '@sveltejs/kit'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
import type { AuthenticatorTransportFuture } from '@simplewebauthn/typescript-types'

import db from '$lib/db'
import redis from '$lib/redis'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ url }) => {
  return {
    fromRegistPage: url.searchParams.get('regist') === '✔'
  }
}

export const actions: Actions = {
  generateAuthenticationOptions: async ({ url }) => {
    const auths = await db.auth.findMany()

    const options = await generateAuthenticationOptions({
      rpID: url.host,
      allowCredentials: auths.map((auth) => ({
        id: auth.credentialID,
        type: 'public-key',
        transports: auth.transports.split(',') as AuthenticatorTransportFuture[]
      })),
      userVerification: 'preferred'
    })

    const authID = uuid()

    await redis.set(authID, options.challenge, {
      EX: 10 * 60 // 10 minutes
    })

    return { authID, options, success: true }
  }
} satisfies Actions
