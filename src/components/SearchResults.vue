<template>
  <div class="search-results">
    <transition-group tag="div">
      <BusinessCard
        v-for="(b) in businesses"
        :business="b"
        :key="b.id"
        class="result"
      />
      <!-- :style="`transition-delay: ${ index * 100 }ms`" -->
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
<style lang="scss" scoped>
  $cubic: cubic-bezier(.65,.05,.36,1);

  .search-results {
    padding: 15px 0;
    display: flex;
    flex-flow: column;

    .result {
      &.v-enter-active,
      &.v-leave-active {
        // transition: transform 500ms $cubic, opacity 500ms $cubic;
        opacity: 1;
      }

      &.v-enter,
      &.v-leave-to {
        opacity: 0;
        transform: translate3d(0px, 50px, 0);
      }
    }
  }
</style>
