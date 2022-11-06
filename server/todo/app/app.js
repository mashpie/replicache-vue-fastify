import fastifyApp from '@uscreen.de/fastify-app'
import fp from 'fastify-plugin'
import socketIO from 'fastify-socket.io'

export default fp((fastify, opts, next) => {
  /**
   * add Socket.io server
   */
  fastify.register(socketIO, { path: `${opts.prefix}/socket` })

  /**
   * register app
   */
  fastify.register(fastifyApp, opts)

  next()
})
