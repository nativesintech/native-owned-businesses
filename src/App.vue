<template>
  <div id="app" class="max-w-screen-sm lg:max-w-screen-lg mx-auto px-4 antialiased">
    <Header />
    <router-view/>
  </div>
</template>

<script>
import Header from '@/components/Header'

export default {
  components: { Header }
}
</script>
