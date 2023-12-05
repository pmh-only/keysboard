import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ cookies }) => {
  cookies.delete('SESSION_TOKEN', {
    path: '/'
  })

  return {}
}
