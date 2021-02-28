<template>
  <LabeledField :name="name" :label="label">
    <component
      class="border border-gray-600 rounded text-lg p-2 mb-4"
      :is="textarea ? 'textarea': 'input'"
      :value.prop="value"
      @input="$emit('input', $event.target.value)"
      @keyup="e => $emit('keyup', e)"
      v-bind="$attrs">
    </component>
  </LabeledField>
</template>
<script>
import LabeledField from './LabeledField'

export default {
  props: ['name', 'label', 'value', 'textarea'],
  components: { LabeledField }
}
</script>
