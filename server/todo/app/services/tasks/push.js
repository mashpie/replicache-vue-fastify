export default (fastify, opts, next) => {
  const { applyMutations } = fastify.replicache

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
        { $set: { deleted: true, _revision } }
      )
    }
  }

  fastify.post('/push', async (req) => {
    const { clientID, mutations } = req.body
    await applyMutations(clientID, mutations, {
      space: 'tasks',
      mutations: taskMutations
    })
    return {}
  })

  next()
}
