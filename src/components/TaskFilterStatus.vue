<script lang="ts" setup>
import {TaskStatus} from '@/types'

const model = defineModel<TaskStatus[]>()

const options = [{
  label: 'Pending',
  value: TaskStatus.Pending
}, {
  label: 'In progress',
  value: TaskStatus.InProgress
}, {
  label: 'Completed',
  value: TaskStatus.Completed
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
