<template>
  <transition-group class="py-4 flex flex-col relative" name="fade-in-left" tag="div" mode="out-in" appear>
    <router-link
      v-for="(business, index) in businesses"
      class="search-result"
      :to="{ name: 'business', params: { id: business.id }}"
      :key="business.id"
      :style="`transition-delay: ${index * 100}ms;`"
      >
      <BusinessCard :business="business" />
    </router-link>
  </transition-group>
</template>

<script>
import BusinessCard from '@/components/BusinessCard'
export default {
  props: ['businesses'],
  components: { BusinessCard }
}
</script>

<style lang="scss" scoped>
.search-result {
  &.fade-in-left-leave-active {
    position: absolute;
    width: 100%;
  }
}
</style>
