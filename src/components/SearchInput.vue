<template>
  <div class="field">
    <h2>{{ label }}</h2>
    <input :placeholder="placeholder" v-model="value" />
  </div>
</template>

<script>
export default {
  data: () => ({ value: '' }),
  props: [ 'placeholder', 'label', 'update' ],
  watch: {
    value (v) {
      this.update(v)
    }
  }
}
</script>

<style lang="scss" scoped>
  $cubic: cubic-bezier(.65,.05,.36,1);
  .field {
    padding-bottom: 10px;

    &.v-enter,
    &.v-leave-to {
      h2, input {
        opacity: 0;
        transform: translate3d(0, 10px, 0);
        color: #F00;
      }
    }

    h2, input {
      opacity: 1;
      transform: translate3d(0,0,0);

      transition: transform 500ms $cubic, opacity 500ms $cubic;
    }

    h2 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 0px;
    }

    input {
      border: none;
      border-bottom: 1px solid #EFEFEF;
      font-size: 25px;
      width: 50%;
      padding: 5px 0;
      margin: 0;

      transition-delay: 100ms;

      &:focus {
        outline: none;
        border-bottom: 1px solid #151515;
      }
    }
  }
</style>
