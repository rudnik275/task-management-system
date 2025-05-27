<script lang="ts" setup>
const model = defineModel<string>()

const options = [{
  label: 'Ascending',
  value: 'asc'
}, {
  label: 'Descending',
  value: 'desc'
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
