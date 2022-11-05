export default (fastify, opts, next) => {
  const { getLastMutationID, getSpaceVersion } = fastify.replicache

  /**
   * Tasks
   */
  const tasks = fastify.mongo.db.collection('tasks')

  fastify.post('/pull', async (req) => {
    let { clientID, cookie, lastMutationID } = req.body
    const currentMutationID = await getLastMutationID(clientID, lastMutationID)

    /**
     * Client is out of sync: trigger a full sync with new clientID.
     */
    if (lastMutationID > currentMutationID) {
      return { error: 'ClientStateNotFound' }
    }

    const changed = await tasks
      .find({ _revision: { $gt: cookie || 0 } })
      .project({ _id: false })
      .toArray()

    let version = await getSpaceVersion('tasks')

    const patch = []
    if (cookie === null) patch.push({ op: 'clear' })

    patch.push(
      ...changed.map((row) => {
        // FIXME: del seams to be broken
        if (row.deleted) {
          return { op: 'del', key: `task/${row.id}` }
        }
        return { op: 'put', key: `task/${row.id}`, value: row }
      })
    )

    return {
      lastMutationID: currentMutationID,
      cookie: version,
      patch
    }
  })

  next()
}
