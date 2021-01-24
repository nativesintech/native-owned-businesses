<template>
  <div id="app" class="max-w-screen-sm lg:max-w-screen-lg mx-auto px-4 antialiased">
    <Header />
    <router-view/>
  </div>
</template>

<script>
import Header from '@/components/Header'
import { parseToken } from './helpers'

export default {
  mounted () {
    const token = localStorage.getItem('session')
    if (token) {
      this.$store.commit('handle_user', parseToken(token))
    }
  },
  components: { Header }
}
</script>
