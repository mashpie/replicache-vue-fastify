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

/**
 * or as array
 */

// import { ref } from 'vue'
// import { id } from '@rnvf/id-generator'

// export const taskList = ref([])

// export const addTask = (task) => {
//   taskList.value.push({ ...task, id: id('task'), done: true })
// }

// export const removeTask = (task) => {
//   const index = taskList.value.findIndex((t) => t.id === task.id)
//   taskList.value.splice(index, 1)
// }

// export const toggleTask = (task) => {
//   task.done = !task.done
// }
