<template>
  <div class="loading">
    <Turtle />
    <div class="message">
      Loading
    </div>
  </div>
</template>
<script>
import Turtle from '@/components/Turtle'
export default {
  components: { Turtle }
}
</script>
<style lang="scss" scoped>
  .loading {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;

    svg {
      animation: rotate 1s infinite forwards;
      width: 100px;
      height: auto;
      padding: 20px;
    }

    .message {
      font-size: 24px;
      font-weight: 700;
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate3d(0,0,0,0);
    }

    100% {
      transform: rotate3d(0,0,1,360deg);
    }
  }
</style>
