import { ref } from 'vue'
import { Replicache } from 'replicache'

export function ReplicacheVue(options) {
  const collection = ref(new Map())
  const prefix = `${options.prefix}/`

  const rep = new Replicache({
    // eslint-disable-next-line no-undef
    licenseKey: import.meta.env.VITE_REPLICACHE_LICENSE_KEY,
    ...options
  })

  /**
   * stable but rerenders whole list (on each change)
   */
  rep.subscribe(async (tx) => tx.scan({ prefix }).entries().toArray(), {
    onData(data) {
      if (collection.value.size <= 0) {
        collection.value = new Map(data)
      }
    }
  })

  /**
   * experimental but rerenders only changed items
   */
  rep.experimentalWatch(
    (diff) => {
      for (const { op, key, newValue } of diff) {
        if (op !== 'del') {
          collection.value.set(key, newValue)
        } else {
          collection.value.delete(key)
        }
      }
    },
    {
      prefix
      // initialValuesInFirstDiff: true // might have performance impact, too
    }
  )

  return { ...rep.mutate, collection }
}
