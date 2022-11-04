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
     * Mutations
     */
    const applyMutations = async (clientID, mutations, aggregate) => {
      /**
       * versions
       */
      const prevVersion = await getSpaceVersion(aggregate.space)
      const nextVersion = prevVersion + 1

      /**
       * mutations
       */
      let lastMutationID = await getLastMutationID(clientID)

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
            aggregate.mutations[mutation.name] ||
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

      await setLastMutationID(clientID, lastMutationID)

      /**
       * FIXME: should this really increase in any case?
       */
      await setSpaceVersion(aggregate.space, nextVersion)
    }

    fastify.decorate('replicache', {
      getSpaceVersion,
      setSpaceVersion,
      getLastMutationID,
      setLastMutationID,
      applyMutations
    })

    next()
  },
  {
    name: 'replicache',
    dependencies: ['mongo']
  }
)
