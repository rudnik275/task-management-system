<script lang="ts" setup>
import type {Task} from '@/types'

import Dialog from './Dialog.vue'
import {useApi} from '@/plugins/api'

const api = useApi()

const formDefaults = {
  title: ''
} as Task

const form = reactive({...formDefaults})
const isLoading = ref(false)
const dialogInstance = ref<InstanceType<typeof Dialog>>()

defineExpose({
  open: async (projectId: number, formState?: Task) => {
    const isNew = formState === undefined
    if (isNew) {
      Object.assign(form, formDefaults)
    } else {
      Object.assign(form, formState)
    }
    await dialogInstance.value!.open()
    isLoading.value = true
    if (isNew) {
      await api.post(`/projects/${projectId}/tasks`, form)
    } else {
      await api.patch(`/projects/${projectId}/tasks/${form.id}`, form)
    }
    isLoading.value = false
  }
})
</script>

<template>
  <Dialog ref="dialogInstance">
    <ElForm
      :model="form"
      v-loading="isLoading"
    >
      <ElFormItem label="Title">
        <ElInput v-model="form.title" autocomplete="off"/>
      </ElFormItem>
      <ElFormItem label="Description">
        <ElInput v-model="form.description" autocomplete="off"/>
      </ElFormItem>
    </ElForm>
  </Dialog>
</template>

<style>
</style>
