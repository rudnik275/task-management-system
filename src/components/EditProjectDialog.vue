<script lang="ts" setup>
import type {Project} from '@/types'

import Dialog from './Dialog.vue'
import {useApi} from '@/plugins/api'

const api = useApi()

const formDefaults = {
  name: ''
} as Project
const form = ref({...formDefaults})
const isLoading = ref(false)
const dialogInstance = ref<InstanceType<typeof Dialog>>()

defineExpose({
  open: async (formState?: Project) => {
    const isNew = formState === undefined
    if (isNew) {
      form.value = {...formDefaults}
    } else {
      form.value = {...formState}
    }
    await dialogInstance.value!.open()
    isLoading.value = true
    if (isNew) {
      await api.post(`/projects`, form.value)
    } else {
      await api.patch(`/projects/${form.value.id}`, form.value)
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
      <ElFormItem label="Name">
        <ElInput v-model="form.name" autocomplete="off"/>
      </ElFormItem>
    </ElForm>
  </Dialog>
</template>

<style>
</style>
