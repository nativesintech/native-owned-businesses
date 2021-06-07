<template>
  <transition-group
    class="py-4 flex flex-col relative" name="fade-in-search" tag="div"
  >
    <BusinessCard
      class="search-result z-10"
      v-for="(business) in businesses"
      :business="business"
      :key="business.id"
    />
    <div
      class="empty-state-wrapper search-result"
      key="none"
      v-if="!businesses.length && !loading"
    ><h2>No Results Found</h2></div>
    <div
      class="empty-state-wrapper search-result"
      key="loader"
      v-else-if="loading"
    ><Loader/></div>
  </transition-group>
</template>

<script>
import BusinessCard from '@/components/BusinessCard'
import Loader from '@/components/Loader'

export default {
  props: ['businesses', 'loading'],
  components: { BusinessCard, Loader }
}
</script>

<style lang="scss" scoped>
.search-result {
  transition: transform 400ms ease, opacity 200ms ease;

  &.fade-in-search-enter, &.fade-in-search-leave-to, &.list-complete-leave-active {
    opacity: 0;
    transform: translate3d(30px, 0, 0);
  }

  &.fade-in-search-leave-active {
    position: absolute;
    width: 100%;
  }
}

.empty-state-wrapper {
  @apply flex text-lg text-gray-700 flex-col justify-center text-center h-64;
}
</style>
