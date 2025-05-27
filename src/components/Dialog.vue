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
    class="base-dialog"
    title="Create/Edit"
  >
    <slot/>

    <template #footer>
      <div class="dialog-footer">
        <el-button
          data-test="cancel"
          @click="cancelEdit?.()"
        >
          Cancel
        </el-button>
        <el-button
          type="primary"
          data-test="confirm"
          @click="successEdit?.()"
        >
          Confirm
        </el-button>
      </div>
    </template>
  </ElDialog>
</template>

<style>
.base-dialog {
  max-width: 500px;
  width: 100%;
}
</style>
