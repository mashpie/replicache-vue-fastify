import { ref } from 'vue'
import { Replicache } from 'replicache'
import { id as newId } from '@rnvf/id-generator'

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

rep.subscribe(async (tx) => tx.scan({ prefix: 'task/' }).entries().toArray(), {
  onData(data) {
    taskList.value = new Map(data)
  }
})

export const taskList = ref(new Map())
export const addTask = rep.mutate.addTask
export const removeTask = rep.mutate.removeTask
export const toggleTask = rep.mutate.toggleTask
