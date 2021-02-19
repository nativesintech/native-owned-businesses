<template>
  <LabeledField :name="name" :label="label">
    <component
      :is="textarea ? 'textarea': 'input'"
      :value="$props.value"
      @input="$emit('input', $event.target.value)"
      class="border border-gray-600 rounded text-lg p-2 mb-4"
      @keyup="e => $emit('keyup', e)"
      v-bind="$attrs"/>
  </LabeledField>
</template>
<script>
import LabeledField from './LabeledField'

export default {
  props: ['name', 'label', 'value', 'textarea'],
  components: { LabeledField }
}
</script>
