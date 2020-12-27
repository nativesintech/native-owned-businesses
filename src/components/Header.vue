<template>
  <router-link
    to="/"
    class="flex py-6 bg-white items-center"
    v-if="!is_embedded"
  >
    <img
      src="@/assets/logo.svg" alt="Logo"
      class="flex-shrink-0 h-12 w-12"
    >
    <h1 class="text-xl sm:text-xl lg:text-4xl text-gray-900 font-bold ml-3">
      Native Owned Businesses
    </h1>
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
