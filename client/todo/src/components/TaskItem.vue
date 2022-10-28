<template>
  <li class="relative flex items-center justify-between border-b px-2 py-4">
    <label class="select-none cursor-pointer">
      <div class="flex h-5 items-center">
        <input
          :checked="task.done"
          type="checkbox"
          class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          @change="toggleTask(task)"
        />
        <div class="ml-3 text-md font-medium text-gray-700">
          {{ task.title }} ({{ task.done }})
        </div>
      </div>
    </label>

    <button
      type="button"
      class="rounded-md border border-transparent text-red-300 bg-white-600 px-2.5 py-1 text-base font-medium hover:text-white hover:bg-red-600 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:text-red-600"
      @click="removeTask(task)"
    >
      <span>Delete</span>
    </button>
  </li>
</template>

<script setup>
import { toggleTask, removeTask } from '../states/tasks'
defineProps({
  task: {
    type: Object,
    required: true
  }
})
</script>
