<template>
  <router-link
    to="/"
    v-if="!is_embedded"
  >
    <header>
      <nav class="flex py-6 bg-white items-center justify-between">
        <div class="flex">
          <img
            src="@/assets/logo.svg" alt="Logo"
            class="flex-shrink-0 h-12 w-12"
          >
          <h1 class="text-xl sm:text-xl lg:text-4xl text-gray-900 font-bold ml-3">
            Native Owned Businesses
          </h1>
        </div>
        <router-link to="/about">
          About
        </router-link>
      </nav>
    </header>
  </router-link>
</template>

<script>
export default {
  computed: {
    is_embedded () {
      return this.$route.query.embed
    }
  }
}
</script>
