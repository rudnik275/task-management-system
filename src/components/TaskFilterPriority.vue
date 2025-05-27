<script lang="ts" setup>
import {TaskPriority} from '@/types'

const model = defineModel<TaskPriority[]>()

const options = [{
  label: 'Low',
  value: TaskPriority.Low
}, {
  label: 'Medium',
  value: TaskPriority.Medium
}, {
  label: 'High',
  value: TaskPriority.High
}]
</script>

<template>
  <ElSelect
    v-model="model"
    multiple
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
