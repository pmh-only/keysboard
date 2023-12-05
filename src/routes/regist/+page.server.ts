import { fail, type Actions } from '@sveltejs/kit'
import { generateRegistrationOptions } from '@simplewebauthn/server'

import redis from '$lib/redis'
import db from '$lib/db'

export const actions: Actions = {
  generateRegistrationOptions: async ({ request, url }) => {
    const data = await request.formData()

    const userID = data.get('user_id')?.toString()
    const userName = data.get('user_name')?.toString()

    if (userID === undefined) {
      return fail(400, { userID, userName, missing: true })
    }

    if (userID.length < 6) {
      return fail(400, { userID, userName, short: true })
    }

    if (userName === undefined || userName.length < 1) {
      return fail(400, { userID, userName, missing: true })
    }

    const oldUserCount = await db.user.count({
      where: {
        OR: [
          { login: userID },
          { nickname: userName }
        ]
      }
    })

    if (oldUserCount > 0) {
      return fail(400, { userID, userName, conflict: true })
    }

    const options = await generateRegistrationOptions({
      rpName: 'KeysBoard',
      rpID: url.host,
      userID,
      userName,
      attestationType: 'none',
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform'
      }
    })

    await redis.set(userID, options.challenge, {
      EX: 10 * 60 // 10 minutes
    })

    return { userID, userName, options, success: true }
  }
} satisfies Actions
