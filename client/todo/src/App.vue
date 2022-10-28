<template>
  <div class="bg-white">
    <div class="mx-auto max-w-3xl p-12 space-y-8">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        <span class="block">Use Replicache in Vue</span>
        <span class="block text-indigo-600">Yet another Demo ToDo App.</span>
      </h2>
      <AddTask />

      <ul v-auto-animate="{ duration: 200 }" class="border-t">
        <TaskItem
          v-for="task of taskList.values()"
          :key="task.id"
          :task="task"
        />
      </ul>
    </div>
  </div>
</template>

<script setup>
import AddTask from './components/AddTask.vue'
import TaskItem from './components/TaskItem.vue'

import { taskList } from './states/tasks'
</script>
