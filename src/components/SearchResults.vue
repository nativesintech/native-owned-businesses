<template>
  <transition-group
    class="py-4 flex flex-col relative" name="fade-in-search" tag="div"
    v-if="businesses.length && !loading"
  >
    <BusinessCard
      class="search-result z-10"
      v-for="(business) in businesses"
      :business="business"
      :key="business.id"
    />
  </transition-group>
  <transition name="fade-in-search" v-else>
    <div class="flex text-lg text-gray-700 flex-col justify-center text-center h-64 search-result" :key="none">
      <h2  v-if="!loading" >No Results Found</h2>
      <Loader v-else/>
    </div>
  </transition>
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
</style>
