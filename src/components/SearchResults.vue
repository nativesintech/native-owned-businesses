<template>
  <div class="py-4 flex flex-col">
    <transition-group name="fade-in-down" tag="div" mode="out-in">
      <BusinessCard
        v-for="(b) in businesses"
        :business="b"
        :key="b.id"
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
