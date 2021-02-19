<template>
  <div class="flex flex-col">
    <label :for="name" class="text-sm text-gray-600 leading-normal mb-2">
      {{label}}
    </label>
    <slot/>
  </div>
</template>
<script>
export default {
  props: ['name', 'label']
}
</script>
