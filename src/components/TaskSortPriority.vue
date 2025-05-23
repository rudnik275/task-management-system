<script lang="ts" setup>
const model = defineModel()

const options = [{
  label: 'Low to High',
  value: 'asc'
}, {
  label: 'High to Low',
  value: 'desc'
}]
</script>

<template>
  <ElSelect
    v-model="model"
    placeholder="Sort by priority"
    clearable
  >
    <ElOption
      v-for="{label, value} in options"
      :label="label"
      :value="value"
    />
  </ElSelect>
</template>

<style>
</style>
