<script lang="ts" setup>
const model = defineModel<string>()

const options = [{
  label: 'Due date',
  value: 'dueDate'
}, {
  label: 'Status',
  value: 'status'
}, {
  label: 'Priority',
  value: 'priority'
}]
</script>

<template>
  <ElSelect v-model="model">
    <ElOption
      v-for="{label, value} in options"
      :label="label"
      :value="value"
    />
  </ElSelect>
</template>

<style>
</style>
