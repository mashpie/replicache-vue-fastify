import { ref } from 'vue'
import { Replicache } from 'replicache'
import { id as newId } from '@rnvf/id-generator'

export const taskList = ref(new Map())

const rep = new Replicache({
  // eslint-disable-next-line no-undef
  licenseKey: import.meta.env.VITE_REPLICACHE_LICENSE_KEY,
  name: `tasks`,
  pushURL: '/api/tasks/push',
  pullURL: '/api/tasks/pull',
  mutators: {
    async addTask(tx, task) {
      const id = newId('task')
      await tx.put(`task/${id}`, { ...task, id, done: false })
    },
    async toggleTask(tx, task) {
      await tx.put(`task/${task.id}`, { ...task, done: !task.done })
    },
    async removeTask(tx, task) {
      await tx.del(`task/${task.id}`)
    }
  }
})

/**
 * stable but rerenders whole list (on each change)
 */
rep.subscribe(async (tx) => tx.scan({ prefix: 'task/' }).entries().toArray(), {
  onData(data) {
    if (taskList.value.size <= 0) {
      taskList.value = new Map(data)
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
        taskList.value.set(key, newValue)
      } else {
        taskList.value.delete(key)
      }
    }
  },
  {
    prefix: 'task/'
    // initialValuesInFirstDiff: true // might have performance impact, too
  }
)

export const addTask = rep.mutate.addTask
export const removeTask = rep.mutate.removeTask
export const toggleTask = rep.mutate.toggleTask
