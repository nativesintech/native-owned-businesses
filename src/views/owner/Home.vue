<template>
  <main>
    <section class="flex justify-between items-center mb-4 align-middle">
      <h1 class="text-2xl">My Businesses</h1>
      <button class="bg-black rounded text-white px-6 py-2" @click="addBusiness">
        Add Business
      </button>
    </section>
    <section v-for="business in businesses" :key="business.id">
      <BusinessCard :business="business" />
    </section>
  </main>
</template>
<script>
import { GET_LOGGED_IN_USER_BUSINESSES } from '@/queries'
import { CONTEXT_LOGGED_IN } from '@/constants'

import BusinessCard from '@/components/BusinessCard'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['user'])
  },
  components: { BusinessCard },
  apollo: {
    businesses: {
      context: CONTEXT_LOGGED_IN,
      query: GET_LOGGED_IN_USER_BUSINESSES,
      variables () {
        return { owner_id: this.user.sub }
      }
    }
  },
  methods: {
    addBusiness () {

    }
  }
}
</script>
