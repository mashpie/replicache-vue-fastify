export default (fastify, opts, next) => {
  fastify.post('/tasks/push', async () => {
    return {}
  })

  fastify.post('/tasks/pull', async () => {
    return {
      lastMutationID: 0,
      cookie: null,
      patch: [
        { op: 'clear' },
        {
          op: 'put',
          key: 'task/1',
          value: { id: '1', title: 'Task 1', done: false }
        },
        {
          op: 'put',
          key: 'task/2',
          value: { id: '2', title: 'Task 2', done: false }
        }
      ]
    }
  })

  next()
}
