<script lang="ts" setup>
import {type Task, TaskPriority, TaskStatus} from '@/types'
import Dialog from './Dialog.vue'
import {useApi} from '@/plugins/api'

const api = useApi()

const formDefaults = {
  title: '',
  description: '',
  dueDate: '',
  status: TaskStatus.Pending,
  priority: TaskPriority.Medium
} as Task

const form = ref({...formDefaults})
const isLoading = ref(false)
const dialogInstance = ref<InstanceType<typeof Dialog>>()
const priorityOptions = [{
  label: 'Low',
  value: TaskPriority.Low
}, {
  label: 'Medium',
  value: TaskPriority.Medium
}, {
  label: 'High',
  value: TaskPriority.High
}]
const statusOptions = [{
  label: 'Pending',
  value: TaskStatus.Pending
}, {
  label: 'In progress',
  value: TaskStatus.InProgress
}, {
  label: 'Completed',
  value: TaskStatus.Completed
}]

defineExpose({
  open: async (projectId: number, formState?: Task) => {
    const isNew = formState === undefined
    if (isNew) {
      form.value = {...formDefaults}
    } else {
      form.value = {...formState}
    }
    await dialogInstance.value!.open()
    isLoading.value = true
    if (isNew) {
      await api.post(`/projects/${projectId}/tasks`, form.value)
    } else {
      await api.patch(`/projects/${projectId}/tasks/${form.value.id}`, form.value)
    }
    isLoading.value = false
  }
})
</script>

<template>
  <Dialog ref="dialogInstance">
    <ElForm
      :model="form"
      label-width="auto"
      v-loading="isLoading"
    >
      <ElFormItem label="Due date">
        <ElDatePicker
          v-model="form.dueDate"
          type="date"
          placeholder="Pick a day"
        />
      </ElFormItem>
      <ElFormItem label="Priority">
        <ElSegmented
          v-model="form.priority"
          :options="priorityOptions"
          data-test="priority"
        />
      </ElFormItem>
      <ElFormItem label="Status">
        <ElSegmented
          v-model="form.status"
          :options="statusOptions"
          data-test="status"
        />
      </ElFormItem>
      <ElFormItem label="Title">
        <ElInput v-model="form.title" autocomplete="off" data-test="title"/>
      </ElFormItem>
      <ElFormItem label="Description">
        <ElInput v-model="form.description" autocomplete="off" type="textarea" data-test="description"/>
      </ElFormItem>
    </ElForm>
  </Dialog>
</template>

<style>
</style>
