<template>
  <div class="py-4 flex flex-col">
    <transition-group name="fade-in-left" tag="div" mode="out-in">
      <router-link
        :to="{ name: 'business', params: { id: business.id }}"
        v-for="(business, index) in businesses"
        :key="business.id"
        >
        <BusinessCard
          :business="business"
          :style="`transition-delay: ${index * 100}ms;`"
        />
      </router-link>
    </transition-group>
  </div>
</template>
<script>
import BusinessCard from '@/components/BusinessCard'
export default {
  props: ['businesses'],
  components: { BusinessCard }
}
</script>
