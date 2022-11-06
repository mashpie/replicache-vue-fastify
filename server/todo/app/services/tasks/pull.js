export default (fastify, opts, next) => {
  const { pullHandler } = fastify.replicache

  /**
   * Tasks
   */
  const tasks = fastify.mongo.db.collection('tasks')
  const taskChanges = async (cookie) =>
    tasks
      .find({ _revision: { $gt: cookie } })
      .project({ _id: false })
      .toArray()

  fastify.post('/pull', async (req) => {
    return await pullHandler(req.body, 'tasks', 'task', taskChanges)
  })

  next()
}
