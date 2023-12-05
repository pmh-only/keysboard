import { redirect, type Actions, fail } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import jwt from '$lib/jwt'
import db from '$lib/db'

export const load: PageServerLoad = async ({ parent }) => {
  const { isLoggined } = await parent()

  if (isLoggined !== true) {
    throw redirect(302, '/auth')
  }

  return {}
}

export const actions: Actions = {
  writeNewPost: async ({ request, cookies }) => {
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

    const title = data.get('title')?.toString()
    const content = data.get('content')?.toString()

    if (title === undefined || title.length < 1) {
      return fail(400, { title, content, missing: true })
    }

    if (content === undefined || content.length < 1) {
      return fail(400, { title, content, missing: true })
    }

    const post = await db.post.create({
      data: {
        userID,
        title,
        content
      }
    })

    throw redirect(302, `/posts/${post.id}`)
  }
}
