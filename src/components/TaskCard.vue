<script lang="ts" setup>
import {formatDate} from '@/composables/format-date.ts'
import TaskStatusTag from '@/components/TaskStatusTag.vue'
import type {Task} from '@/types'

const {} = defineProps<{
  task: Task
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
        <TaskStatusTag :status="task.status"/>
        <ElButtonGroup>
          <ElButton
            icon="edit"
            @click="emit('edit')"
          />
          <ElButton
            icon="delete"
            @click="emit('remove')"
          />
        </ElButtonGroup>
      </div>

      <div class="task-card__priority">
        <ElText type="info">Priority:</ElText>
        {{ task.priority }}
      </div>

      <div>
        <ElText type="info">Due date:</ElText>
        {{ formatDate(task.dueDate) }}
      </div>
    </template>

    <div class="task-card__title">{{ task.title }}</div>
    <div class="task-card__description">{{ task.description }}</div>
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
