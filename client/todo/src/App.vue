<template>
  <div class="bg-white">
    <div class="mx-auto max-w-3xl p-12">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        <span class="block">Use Replicache in Vue</span>
        <span class="block text-indigo-600">Yet another Demo ToDo App.</span>
      </h2>

      <div class="mt-8">
        <div class="mt-1 flex rounded-md shadow-sm">
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
      </div>

      <ul class="mt-8 border-t">
        <li
          class="relative flex items-center justify-between border-b px-2 py-4"
        >
          <label class="select-none cursor-pointer">
            <div class="flex h-5 items-center">
              <input
                id="candidates"
                aria-describedby="candidates-description"
                name="candidates"
                type="checkbox"
                class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div class="ml-3 text-md font-medium text-gray-700">
                Something that really should be done asdölk
              </div>
            </div>
          </label>

          <button
            type="button"
            class="rounded-md border border-transparent text-red-300 bg-white-600 px-2.5 py-1 text-base font-medium hover:text-white hover:bg-red-600 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <span>Delete</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
console.log('setup')
</script>
