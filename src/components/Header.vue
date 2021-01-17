<template>
  <header
      class="py-6 bg-white"
      v-if="!is_embedded"
    >
    <nav class="flex items-center justify-between w-100">
      <div class="flex items-center">
        <a href="/">
          <img
            src="@/assets/logo.svg" alt="Logo"
            class="flex-shrink-0 h-12 w-12"
          >
        </a>
        <h1 class="text-xl sm:text-xl lg:text-4xl text-gray-900 font-bold ml-3">
          Native Owned Businesses
        </h1>
      </div>
      <a href="/about">About</a>
    </nav>
    </header>
</template>
<script>
export default {
  props: ['is_embedded']
}
</script>
