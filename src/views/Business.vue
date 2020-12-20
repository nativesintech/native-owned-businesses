<template>
  <div class="flex flex-col text-left">
    <div class="py-4 flex flex-col">
      <transition name="fade-in-left" tag="div" mode="out-in" appear v-if="business">
        <BusinessCard
          :business="business"
        />
      </transition>
    </div>
  </div>
</template>
<script>
import BusinessCard from '@/components/BusinessCard'
import { GET_BUSINESS_BY_ID } from '@/queries'
export default {
  props: ['id'],
  components: { BusinessCard },
  apollo: {
    business: {
      query () {
        return GET_BUSINESS_BY_ID
      },
      variables () {
        const { id } = this
        return { id }
      },
      update (data) {
        return data.business[0]
      }
    }
  }
}
</script>
