import db from '$lib/db'
import jwt from '$lib/jwt'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ cookies }) => {
  const sessionToken = cookies.get('SESSION_TOKEN')

  if (sessionToken === undefined) {
    return {
      isLoggined: false
    }
  }

  const userID = jwt.verifyToken(sessionToken)
  if (userID === undefined) {
    cookies.delete('SESSION_TOKEN', {
      path: '/'
    })

    return {
      isLoggined: false
    }
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

    return {
      isLoggined: false
    }
  }

  return {
    isLoggined: true,
    userName: user.userName
  }
}
