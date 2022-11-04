import { ReplicacheVue } from './_replicache-vue.js'
import { id as newId } from '@rnvf/id-generator'

const cache = new ReplicacheVue({
  name: `tasks`,
  prefix: `task`,
  pushURL: '/api/tasks/push',
  pullURL: '/api/tasks/pull',
  /**
   * mutations propagate to the server with called payload
   */
  mutators: {
    async addTask(tx, task) {
      await tx.put(`task/${task.id}`, task)
    },
    async toggleTask(tx, task) {
      await tx.put(`task/${task.id}`, task)
    },
    async removeTask(tx, task) {
      await tx.del(`task/${task.id}`)
    }
  }
})

export const taskList = cache.collection

export const addTask = (task) => {
  task.id = newId('task')
  cache.addTask({ ...task, done: false })
}

export const toggleTask = (task) => {
  cache.toggleTask({ ...task, done: !task.done })
}

export const removeTask = cache.removeTask
