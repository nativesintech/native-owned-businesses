<template>
  <div class="py-4 flex flex-col">
    <transition-group name="fade-in-down" tag="div" mode="out-in">
      <BusinessCard
        v-for="(business, index) in businesses"
        :business="business"
        :key="business.id"
        :style="`transition-delay: ${index * 100}ms;`"
      />
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
