<script lang="ts" setup>
import {formatDate} from '@/composables/format-date.ts'
import TaskStatusTag from '@/components/TaskStatusTag.vue'
import {TaskPriority, TaskStatus} from '@/types'

const {} = defineProps<{
  title: string
  description: string
  dueDate: string
  status: TaskStatus
  priority: TaskPriority
}>()
const emit = defineEmits<{
  edit: []
  remove: []
}>()
</script>

<template>
  <ElCard>
    <template #header>
      <div class="task-card__header">
        <TaskStatusTag :status="status"/>
        <ElButtonGroup>
          <ElButton
            icon="edit"
            data-test="task-edit-button"
            @click="emit('edit')"
          />
          <ElButton
            icon="delete"
            data-test="task-remove-button"
            @click="emit('remove')"
          />
        </ElButtonGroup>
      </div>

      <div class="task-card__priority">
        <ElText type="info">Priority:</ElText>
        {{ priority }}
      </div>

      <div>
        <ElText type="info">Due date:</ElText>
        {{ formatDate(dueDate) }}
      </div>
    </template>

    <div class="task-card__title">{{ title }}</div>
    <div class="task-card__description">{{ description }}</div>
  </ElCard>
</template>

<style>
.task-card__header {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.task-card__priority {
  margin: 8px 0;
}

.task-card__title {
  font-size: 18px;
  font-weight: 600;
}

.task-card__description {
  line-height: 1.4;
  margin-top: 12px;
  font-size: 14px;
  color: var(--el-color-info);
}
</style>
