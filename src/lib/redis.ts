import { createClient } from 'redis'
import { env } from '$env/dynamic/private'

const redis = createClient({
  url: env.REDIS_URL
})

void redis.connect()

export default redis
