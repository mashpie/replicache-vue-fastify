import { ref } from 'vue'
import { id as newId } from '@rnvf/id-generator'

export const taskList = ref(new Map())

export const addTask = (task) => {
  const id = newId('task')
  taskList.value.set(id, { ...task, id, done: false })
}

export const removeTask = (task) => {
  taskList.value.delete(task.id)
}

export const toggleTask = (task) => {
  task.done = !task.done
}
