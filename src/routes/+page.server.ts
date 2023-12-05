import db from '$lib/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      user: {
        select: {
          userName: true
        }
      }
    },
    orderBy: {
      id: 'desc'
    }
  })

  return {
    posts
  }
}
