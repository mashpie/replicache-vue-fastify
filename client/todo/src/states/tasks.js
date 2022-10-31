import { ReplicacheVue } from './_replicache-vue.js'
import { id as newId } from '@rnvf/id-generator'

const cache = new ReplicacheVue({
  name: `tasks`,
  prefix: `task`,
  pushURL: '/api/tasks/push',
  pullURL: '/api/tasks/pull',
  mutators: {
    async addTask(tx, task) {
      task.id = newId('task')
      await tx.put(`task/${task.id}`, { ...task, done: false })
    },
    async toggleTask(tx, task) {
      await tx.put(`task/${task.id}`, { ...task, done: !task.done })
    },
    async removeTask(tx, task) {
      await tx.del(`task/${task.id}`)
    }
  }
})

export const taskList = cache.collection
export const addTask = cache.addTask
export const removeTask = cache.removeTask
export const toggleTask = cache.toggleTask
