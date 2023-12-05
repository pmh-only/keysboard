import { v4 as uuid } from 'uuid'
import { fail, type Actions, redirect } from '@sveltejs/kit'
import { generateRegistrationOptions } from '@simplewebauthn/server'

import redis from '$lib/redis'
import db from '$lib/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ parent }) => {
  const { isLoggined } = await parent()

  if (isLoggined) {
    throw redirect(302, '/')
  }
}

export const actions: Actions = {
  generateRegistrationOptions: async ({ request, url }) => {
    const data = await request.formData()

    const userName = data.get('userName')?.toString()
    if (userName === undefined || userName.length < 1) {
      return fail(400, { userName, missing: true })
    }

    const oldUserCount = await db.user.count({
      where: {
        userName
      }
    })

    if (oldUserCount > 0) {
      return fail(400, { userName, conflict: true })
    }

    const userID = uuid()

    const options = await generateRegistrationOptions({
      rpName: 'KeysBoard',
      rpID: url.host,
      userID,
      userName,
      attestationType: 'none',
      authenticatorSelection: {
        residentKey: 'required',
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
