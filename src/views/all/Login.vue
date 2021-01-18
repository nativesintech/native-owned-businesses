<template>
  <main>
    <h1 class="text-2xl mb-4 font-bold" v-if="!is_logged_in">Login</h1>
    <form @submit="handle_submit" class="mb-4" v-if="!is_logged_in">
      <label for="email" class="text-sm text-gray-600 leading-normal mb-2">Email</label><br />
      <input required id="email" v-model="email" name="email" class="border-2 border-gray-600 rounded text-lg p-2 mb-4" type="email" /><br/>
      <button class="bg-black text-white px-6 py-2 rounded" type="submit">Login</button>
    </form>
    <section class="mb-4" v-if="is_logged_in">You are logged in!</section>
    <button v-on:click="logout" class="bg-black text-white px-6 py-2 rounded" v-if="is_logged_in">Logout</button>
  </main>
</template>
<script>
import { parseToken } from '../../helpers'

export default {
  data () {
    return {
      email: undefined
    }
  },
  methods: {
    handle_submit (e) {
      e.preventDefault()

      // Submit Form
    },
    logout (e) {
      localStorage.removeItem('session')
      this.$store.commit('handle_user', undefined)
    }
  },
  mounted () {
    const token = this.$route.query.token

    if (token) {
      localStorage.setItem('session', token)
      this.$store.commit('handle_user', parseToken(token))
    }
  },
  computed: {
    is_logged_in () {
      return Boolean(this.$store.state.user)
    }
  }

}
</script>