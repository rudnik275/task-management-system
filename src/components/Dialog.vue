<script lang="ts" setup>
const isVisible = ref(false)

let successEdit: () => Promise<void>
let cancelEdit: () => void

defineExpose({
  open: async () => {
    isVisible.value = true
    await new Promise<void>((resolve, reject) => {
      successEdit = async () => {
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
    width="500"
  >
    <slot/>

    <template #footer>
      <div class="dialog-footer">
        <el-button
          @click="cancelEdit?.()"
        >
          Cancel
        </el-button>
        <el-button
          type="primary"
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
