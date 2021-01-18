<template>
  <main>
    <section class="flex justify-between items-center mb-4">
      <h1 class="font-bold text-2xl">My Businesses</h1>
      <router-link to="/owner/b/new" class="bg-black rounded text-white px-6 py-2">
        Add Business
      </router-link>
    </section>
    <section v-for="business in businesses" :key="business.id">
      <BusinessCard :business="business" :edit="true" />
    </section>
  </main>
</template>
<script>
import { GET_LOGGED_IN_USER_BUSINESSES } from '@/queries'
import BusinessCard from '@/components/BusinessCard'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['user'])
  },
  apollo: {
    businesses: {
      query: GET_LOGGED_IN_USER_BUSINESSES,
      variables () {
        return { owner_id: this.user.sub }
      },
      context: {
        headers: {
          'x-hasura-role': 'user'
        }
      }
    }
  },
  components: {
    BusinessCard
  }

}
</script>
