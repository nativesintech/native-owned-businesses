<template>
  <router-link
    to="/"
    v-if="!is_embedded"
  >
    <header>
      <nav class="flex py-6 bg-white items-center justify-between">
        <div class="flex items-center">
          <img
            src="@/assets/logo.svg" alt="Logo"
            class="flex-shrink-0 h-12 w-12"
          >
          <h1 class="hidden md:block text-xl text-gray-900 font-bold ml-3">
            Native Owned Businesses
          </h1>
        </div>
        <div class="space-x-2">
          <router-link to="/about">
            About
          </router-link>
          <router-link to="/login" v-if="!is_logged_in">
            Login
          </router-link>
          <router-link to="/owner" v-if="is_logged_in">
            My Profile
          </router-link>
          <router-link to="/login" v-if="is_logged_in">
            Logout
          </router-link>
        </div>
      </nav>
    </header>
  </router-link>
</template>

<script>
export default {
  data () {
    return {
      is_embedded: this.$route.query.embed
    }
  },
  computed: {
    is_logged_in () {
      return Boolean(this.$store.state.user)
    }
  }
}
</script>
