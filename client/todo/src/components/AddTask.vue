<template>
  <div class="flex rounded-md shadow-sm">
    <div class="relative flex flex-grow items-stretch focus-within:z-10">
      <input
        class="block w-full rounded-none rounded-l-md pl-5 border-2 border-indigo-600 focus:outline-none"
        placeholder="Get that shit done"
      />
    </div>
    <button
      type="button"
      class="relative -ml-px inline-flex items-center justify-center rounded-r-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <span>Add Task</span>
    </button>
  </div>
</template>

<script setup></script>
