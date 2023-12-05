import { redirect } from '@sveltejs/kit'
import db from '../../../lib/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
  const postId = parseInt(params.postId)

  if (Number.isNaN(postId)) {
    throw redirect(302, '/')
  }

  const post = await db.post.findUnique({
    select: {
      id: true,
      title: true,
      content: true,
      user: {
        select: {
          userName: true
        }
      }
    },
    where: {
      id: postId
    }
  })

  if (post === null) {
    throw redirect(302, '/')
  }

  return {
    post
  }
}
