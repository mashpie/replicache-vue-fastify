export default (fastify, opts, next) => {
  const { pushHandler } = fastify.replicache

  /**
   * Tasks
   */
  const tasks = fastify.mongo.db.collection('tasks')
  const taskMutations = {
    async addTask({ id, ...payload }) {
      await tasks.findOneAndUpdate(
        { id },
        { $set: { ...payload } },
        { upsert: true }
      )
    },
    async toggleTask({ id, ...payload }) {
      await tasks.findOneAndUpdate(
        { id },
        { $set: { ...payload } },
        { upsert: false }
      )
    },
    async removeTask({ id, _revision }) {
      await tasks.findOneAndUpdate(
        { id },
        { $set: { deleted: true, _revision } },
        { upsert: false }
      )
    }
  }

  fastify.post('/push', async (req) => {
    await pushHandler(req.body, 'tasks', taskMutations)
    return {}
  })

  next()
}
