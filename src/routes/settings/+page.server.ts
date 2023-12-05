import { fail, type Actions, redirect } from '@sveltejs/kit'
import db from '$lib/db'
import jwt from '$lib/jwt'

export const actions: Actions = {
  saveSettings: async ({ request, cookies }) => {
    const data = await request.formData()
    const sessionToken = cookies.get('SESSION_TOKEN')

    if (sessionToken === undefined) {
      throw redirect(302, '/auth')
    }

    const userID = jwt.verifyToken(sessionToken)
    if (userID === undefined) {
      cookies.delete('SESSION_TOKEN', {
        path: '/'
      })

      throw redirect(302, '/auth')
    }

    const user = await db.user.findUnique({
      where: {
        userID
      }
    })

    if (user === null) {
      cookies.delete('SESSION_TOKEN', {
        path: '/'
      })

      throw redirect(302, '/auth')
    }

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

    await db.user.update({
      where: {
        userID
      },
      data: {
        userName
      }
    })

    return {
      success: true
    }
  }
}
