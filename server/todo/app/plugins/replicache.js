import fp from 'fastify-plugin'

export default fp(
  (fastify, opts, next) => {
    /**
     * Spaces: Each space has a version that increments for each push processed.
     */
    const spaces = fastify.mongo.db.collection('replicacheSpaces')

    const getSpaceVersion = async (scope = 'global') => {
      const result = await spaces.findOne({ scope })
      return result?.revision || 0
    }

    const setSpaceVersion = async (scope = 'global', revision) => {
      await spaces.findOneAndUpdate(
        { scope },
        { $set: { revision } },
        { upsert: true }
      )
    }

    /**
     * Clients: Stores last mutationID processed for each Replicache client.
     */
    const clients = fastify.mongo.db.collection('replicacheClients')

    const getLastMutationID = async (clientID) => {
      const client = await clients.findOne({ clientID })
      return client?.lastMutationID || 0
    }

    const setLastMutationID = async (clientID, lastMutationID) => {
      await clients.findOneAndUpdate(
        { clientID },
        { $set: { lastMutationID } },
        { upsert: true }
      )
    }

    /**
     * PUSH: applyMutations
     */
    const pushHandler = async (body, space = 'global', spaceMutations) => {
      const { clientID, mutations } = body
      /**
       * versions and lastMutationID are used to determine if the client is out of sync.
       */
      let [prevVersion, lastMutationID] = await Promise.all([
        getSpaceVersion(space),
        getLastMutationID(clientID)
      ])
      const nextVersion = prevVersion + 1

      for (const mutation of mutations) {
        /**
         * Calculate the expected next mutationID.
         */
        const expectedMutationID = lastMutationID + 1

        /**
         * It's common due to connectivity issues for clients to send a
         * mutation which has already been processed. Skip these.
         */
        if (mutation.id < expectedMutationID) {
          fastify.log.warn(
            `Mutation ${mutation.id} has already been processed - skipping`
          )
          continue
        }

        /**
         * If the Replicache client is working correctly, this can never
         * happen. If it does there is nothing to do but return an error to
         * client and report a bug to Replicache.
         */
        if (mutation.id > expectedMutationID) {
          fastify.log.warn(
            `Mutation ${mutation.id} is from the future - aborting`
          )
          break
        }

        /**
         * For each possible mutation, run the server-side logic
         * to apply the mutation.
         */
        try {
          const mutationFn =
            spaceMutations[mutation.name] ||
            (() => {
              fastify.log.warn(`Unknown mutation ${mutation.name}`)
            })
          await mutationFn({ ...mutation.args, _revision: nextVersion })
        } catch (e) {
          /**
           * Unhandled errors from mutations are discouraged. It is hard to
           * know whether the error is temporary (and would be resolved if we
           * retry the mutation later) or permanent (and would thus block that
           * client forever). We recommend to bias toward skipping such
           * mutations and avoiding blocking the client from progressing.
           */
          fastify.log.error('Error processing mutation - skipping')
          fastify.log.error(e)
        }

        lastMutationID = expectedMutationID
      }

      await Promise.all([
        setLastMutationID(clientID, lastMutationID),
        setSpaceVersion(space, nextVersion)
      ])
    }

    /**
     * PULL: pull changes for space
     */
    const pullHandler = async (
      body,
      space = 'global',
      prefix = '',
      getChanges
    ) => {
      const { clientID, cookie, lastMutationID } = body

      /**
       * Get the current known mutationID for this client
       */
      const currentMutationID = await getLastMutationID(
        clientID,
        lastMutationID
      )

      /**
       * Client is out of sync: trigger a full sync with new clientID.
       */
      if (lastMutationID > currentMutationID) {
        return { error: 'ClientStateNotFound' }
      }

      /**
       * fetch version and changes
       */
      const [version, changed] = await Promise.all([
        getSpaceVersion(space),
        getChanges(cookie || 0)
      ])

      /**
       * calculate the changeset
       */
      const patch = []
      if (cookie === null) patch.push({ op: 'clear' })
      patch.push(
        ...changed.map((row) => {
          if (row.deleted) {
            return { op: 'del', key: `${prefix}/${row.id}` }
          }
          return { op: 'put', key: `${prefix}/${row.id}`, value: row }
        })
      )

      /**
       * pullresponse
       */
      return {
        lastMutationID: currentMutationID,
        cookie: version,
        patch
      }
    }

    fastify.decorate('replicache', {
      getSpaceVersion,
      setSpaceVersion,
      getLastMutationID,
      setLastMutationID,
      pushHandler,
      pullHandler
    })

    next()
  },
  {
    name: 'replicache',
    dependencies: ['mongo']
  }
)
