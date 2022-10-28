import { ref, reactive } from 'vue'
import { id } from '@rnvf/id-generator'

export const taskList = ref([])

export const addTask = (task) => {
  taskList.value.push(
    reactive({
      ...task,
      done: true,
      id: id('task')
    })
  )
}

export const removeTask = (task) => {
  const index = taskList.value.indexOf(task)
  taskList.value.splice(index, 1)
}

export const toggleTask = (task) => {
  task.done = !task.done
}
