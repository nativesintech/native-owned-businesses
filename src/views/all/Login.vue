<template>
  <main class="flex items-center justify-center">
    <div class="flex-grow max-w-md space-y-4">
      <h1 class="text-2xl mb-4 font-bold text-center" v-if="!isLoggedIn">Login with Email</h1>
      <section class="space-y-4" v-if="!isLoggedIn">
        <p class="text-gray-600">If you have been added to the directory, then a link will be sent to your email to login.</p>
        <p class="text-gray-600"> If you have not been added to the directory, please send an email to <a class="underline" href="mailto:nob@nativesintech.org">nob@nativesintech.org</a> with your email, business, and nation so that we can add you.</p>
      </section>
      <form @submit="handle_submit" class="mb-4 space-y-4" v-if="!isLoggedIn">
        <transition name="fade-in-down">
          <div v-if="loginState !== SaveStates.SUCCESS">
            <label for="address" class="text-sm text-gray-600 leading-normal mb-2">Email</label><br />
            <input
              required
              id="email"
              name="address"
              class="border border-gray-600 rounded text-lg p-2 mb-4 min-w-full"
              type="email"
              v-model="email"
              :disabled="loginState == SaveStates.SAVING"
            /><br/>
            <button
              type="submit"
              class="bg-black text-white px-6 py-2 rounded min-w-full hover:bg-gray-900 transition-colors duration-200"
              :class="{ 'opacity-50': loginState == SaveStates.SAVING }"
              :disabled="loginState === SaveStates.SAVING"
            >Login</button>
          </div>
        </transition>
        <transition name="fade-in-down">
          <div
            v-if="feedbackMessage"
            class="p-4 text-center transition-colors duration-200"
            :class="{
              'bg-blue-100 text-blue-500': loginState === SaveStates.SAVING,
              'bg-green-100 text-green-500': loginState === SaveStates.SUCCESS,
              'bg-red-100 text-red-500': loginState === SaveStates.ERROR
            }"
          >{{ feedbackMessage }}</div>
        </transition>
      </form>
      <section class="text-gray-600 space-y-2 text-center" v-if="isLoggedIn">
        <p>You are logged in!</p>
        <p>Click on the logout button below to logout.</p>
      </section>
      <button v-on:click="logout" class="bg-black text-white px-6 py-2 rounded min-w-full" v-if="isLoggedIn">Logout</button>
    </div>
  </main>
</template>
<script>
import { parseToken } from '../../helpers'
import { AUTH_URL, SaveStates } from '../../constants'
import axios from 'axios'

export default {
  data () {
    return {
      email: undefined,
      response: undefined,
      loginState: undefined,
      SaveStates
    }
  },
  methods: {
    async handle_submit (e) {
      e.preventDefault()
      const data = Object.fromEntries(new FormData(e.target).entries())

      this.loginState = SaveStates.SAVING

      await axios({
        url: `${AUTH_URL}/auth/email`,
        method: 'POST',
        data
      }).then(response => {
        this.$data.response = response
        this.loginState = SaveStates.SUCCESS
      }).catch((e) => {
        this.$data.response = e.response
        this.loginState = SaveStates.ERROR
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
    isLoggedIn () {
      return Boolean(this.$store.state.user)
    },
    feedbackMessage () {
      const state = this.loginState
      if (state === SaveStates.SAVING) return 'Loading...'
      if (state === SaveStates.SUCCESS) return 'Success! Login information was sent to your email.'
      if (state === SaveStates.ERROR) return `Sorry! ${this.response.data.message}`
      return null
    }
  }

}
</script>
