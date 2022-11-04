import fp from 'fastify-plugin'
import mongodb from '@fastify/mongodb'

/**
 * mongodb related
 */
export default fp(
  (fastify, opts, next) => {
    fastify.register(mongodb, {
      forceClose: true,
      useUnifiedTopology: true,
      url: opts.mongoUri
    })

    next()
  },
  {
    name: 'mongo'
  }
)
