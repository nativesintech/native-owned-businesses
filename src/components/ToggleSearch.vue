<template>
  <div class="toggle-input" :class="{ enabled }">
    <button
      class="button-knockout"
      :class="{ selected: enabled }"
      @click.prevent="toggle"
    >{{text}}</button>
    <div class="envelope" v-if="search">
      <input
        v-model="value"
        placeholder="Search"
        :disabled="!enabled"
        @keyup.backspace="backspace"
        ref="input" />
    </div>
  </div>
</template>
<script>
export default {
  props: [ 'text', 'onchange', 'search' ],
  data () { return { enabled: false, value: '', empty: false } },
  methods: {
    toggle () {
      this.enabled = !this.enabled
      if (!this.search) {
        this.value = this.enabled
      } else if (!this.enabled) {
        this.value = ''
      }
    },
    /* TODO(nsahler): make it not close when there's one character left */
    backspace (e) {
      if (this.search && this.value.length === 0) {
        if (this.empty) {
          this.enabled = false
        }

        this.empty = true
      }
    },
    focus (e) {
      if (this.search && !this.enabled) {
        this.enabled = true
        this.$refs.input.focus()
      }
    }
  },
  watch: {
    value (v) {
      this.empty = false
      this.onchange(v)
    }
  }
}
</script>
<style lang="scss">
  @import '@/styles/variables.scss';

  .toggle-input {
    display: flex;
    flex-flow: row;
    align-items: stretch;
    overflow: hidden;

    input {
      border: 1px solid $fill_color_disabled;
      border-left: none;
      padding: 5px 10px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      font-size: $font_size;
      background-color: #FFF;

      &:focus {
        outline: none;
        border-color: $fill_color;
      }
    }

    .envelope {
      width: 0px;
      transition: width 300ms $cubic;
      box-sizing: border-box;
      overflow: hidden;
    }

    &.enabled {
      .envelope {
        width: 250px;
      }
    }
  }
</style>
