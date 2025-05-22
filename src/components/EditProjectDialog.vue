<script lang="ts" setup>
import {useApi} from '@/plugins/api'

const api = useApi()

const isVisible = ref(false)
const form = reactive({
  name: ''
})
const isLoading = ref(false)
const isNew = ref(false)

let successEdit: () => Promise<void>
let cancelEdit: () => void

defineExpose({
  open: async (projectId?: number) => {
    isVisible.value = true
    form.name = ''
    isNew.value = projectId === undefined
    if (!isNew.value) {
      isLoading.value = true
      const loadedProject = await api.get(`/projects/${projectId}`)
      form.name = loadedProject.name
      isLoading.value = false
    }
    await new Promise<void>((resolve, reject) => {
      successEdit = async () => {
        isLoading.value = true
        if (isNew.value) {
          await api.post('/projects', form)
        } else {
          await api.patch(`/projects/${projectId}`, form)
        }
        isLoading.value = false
        isVisible.value = false
        resolve()
      }
      cancelEdit = () => {
        isVisible.value = false
        reject()
      }
    })
  }
})
</script>

<template>
  <ElDialog
    v-model="isVisible"
    :title="isNew ? `Create new project` : 'Edit project'"
    width="500"
  >
    <ElForm
      :model="form"
      v-loading="isLoading"
    >
      <ElFormItem label="Name">
        <ElInput v-model="form.name" autocomplete="off"/>
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          :disabled="isLoading"
          @click="cancelEdit?.()"
        >
          Cancel
        </el-button>
        <el-button
          type="primary"
          :disabled="!form.name || isLoading"
          @click="successEdit?.()"
        >
          Confirm
        </el-button>
      </div>
    </template>
  </ElDialog>
</template>

<style>
</style>
