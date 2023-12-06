import { createClient } from 'redis'
import { env } from '$env/dynamic/private'
import { building } from '$app/environment'

const redis = createClient({
  url: env.REDIS_URL
})

if (!building) {
  void redis.connect()
}

export default redis
