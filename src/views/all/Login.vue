<template>
  <main class="flex items-center justify-center login-screen">
    <div class="flex-grow max-w-md space-y-4">
      <h1 class="text-2xl mb-4 font-bold text-center" v-if="!is_logged_in">Login with Email</h1>
      <section v-if="!is_logged_in">
        <p class="text-gray-600">If you have been added to the directory, then a link will be sent to your email to login.</p>
        <p class="text-gray-600"> If you have not been added to the directory, please send an email to <a class="underline" href="mailto:nob@nativesintech.org">nob@nativesintech.org</a> with your email, business, and nation so that we can add you.</p>
      </section>
      <form @submit="handle_submit" class="mb-4 space-y-4" v-if="!is_logged_in">
        <label for="address" class="text-sm text-gray-600 leading-normal mb-2">Email</label><br />
        <input required id="email" v-model="email" name="address" class="border border-gray-600 rounded text-lg p-2 mb-4 min-w-full" type="email" /><br/>
        <button class="bg-black text-white px-6 py-2 rounded min-w-full" type="submit">Login</button>
        <div style="minHeight: 56px;">
          <div class="bg-green-100 text-green-500 p-4 text-center" v-if="response && response.status === 200">Success! Login information was sent to your email.</div>
          <div class="bg-red-100 text-red-500 p-4 text-center" v-if="response && response.status !== 200">Sorry! {{ response.data.message}} </div>
        </div>
      </form>
      <section class="text-gray-600" v-if="is_logged_in">You are logged in! Click on the logout button below to logout.</section>
      <button v-on:click="logout" class="bg-black text-white px-6 py-2 rounded min-w-full" v-if="is_logged_in">Logout</button>
    </div>
  </main>
</template>
<script>
import { parseToken } from '../../helpers'
import { AUTH_URL } from '../../constants'
import axios from 'axios'

export default {
  data () {
    return {
      email: undefined,
      response: undefined
    }
  },
  methods: {
    async handle_submit (e) {
      e.preventDefault()
      const data = Object.fromEntries(new FormData(e.target).entries())

      await axios({
        url: `${AUTH_URL}/auth/email`,
        method: 'POST',
        data
      }).then(response => {
        this.$data.response = response
      }).catch((e) => {
        this.$data.response = e.response
      })
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
