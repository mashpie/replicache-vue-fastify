export default (fastify, opts, next) => {
  const { getLastMutationID, getSpaceVersion } = fastify.replicache

  /**
   * Tasks
   */
  const tasks = fastify.mongo.db.collection('tasks')

  fastify.post('/pull', async (req) => {
    const { clientID, cookie } = req.body
    const lastMutationID = await getLastMutationID(clientID)

    const changed = await tasks
      .find({ _revision: { $gt: cookie || 0 } })
      .project({ _id: false })
      .toArray()

    const version = await getSpaceVersion('tasks')

    const patch = []
    if (cookie === null || cookie === 0) {
      patch.push({ op: 'clear' })
    }

    patch.push(
      ...changed.map((row) => {
        if (row.deleted) {
          return { op: 'del', key: `task/${row.id}` }
        }
        return { op: 'put', key: `task/${row.id}`, value: row }
      })
    )

    return {
      lastMutationID,
      cookie: version,
      patch
    }
  })

  next()
}