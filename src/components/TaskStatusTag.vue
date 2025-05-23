<script lang="ts" setup>
import {TaskStatus} from '@/types'

const {} = defineProps<{
  status: TaskStatus
}>()
</script>

<template>
  <ElTag v-if="status === TaskStatus.Pending" disable-transitions type="info">Status: Pending</ElTag>
  <ElTag v-if="status === TaskStatus.InProgress" disable-transitions type="primary">Status: In progress</ElTag>
  <ElTag v-if="status === TaskStatus.Completed" disable-transitions type="success">Status: Completed</ElTag>
</template>

<style>
</style>
