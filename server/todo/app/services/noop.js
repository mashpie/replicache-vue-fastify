export default (fastify, opts, next) => {
  fastify.get('/noop', async () => {
    return {
      noop: 'Hello world',
      plugin: fastify.noop()
    }
  })

  next()
}
