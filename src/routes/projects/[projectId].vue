<script lang="ts" setup>
import {type Task} from '@/types'
import {useApi} from '@/plugins/api'
import {useTasksStore} from '@/stores/tasks.ts'
import EditTaskDialog from '@/components/EditTaskDialog.vue'
import TaskCard from '@/components/TaskCard.vue'
import TaskFilterStatus from '@/components/TaskFilterStatus.vue'
import TaskFilterPriority from '@/components/TaskFilterPriority.vue'
import TaskSortAttr from '@/components/TaskSortAttr.vue'
import TaskSortDirection from '@/components/TaskSortDirection.vue'

const api = useApi()
const tasksStore = useTasksStore()
const {loadProjectTasks} = tasksStore
const {
  projectTasks,
  project,
  projectId,
  isLoading,
  priorityFilter,
  sortAttr,
  sortDirection,
  statusFilter,
} = toRefs(tasksStore)

loadProjectTasks()

// Edit
const editTaskDialogInstance = ref<InstanceType<typeof EditTaskDialog>>()
const openEditTaskDialog = async (task?: Task) => {
  try {
    await editTaskDialogInstance.value!.open(projectId.value, task)
    ElMessage({
      message: task ? 'Changed' : 'Added',
      type: 'success',
      plain: true,
    })
    await loadProjectTasks()
  } catch {
    // in case need to do something on cancel
  }
}

// Remove
const removeTask = async (task: Task) => {
  try {
    await ElMessageBox.confirm(
      `Task "${task.title}" will be removed permanently`,
      {
        confirmButtonText: 'Remove',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    await api.delete(`/projects/${projectId.value}/tasks/${task.id}`)
    ElMessage({
      message: 'Removed',
      type: 'success',
      plain: true,
    })
    await loadProjectTasks()
  } catch {
    // in case need to do something on cancel
  }
}
</script>

<template>
  <div class="project-tasks__header">
    <h1 class="project-tasks__title">
      Tasks of "{{ project.name }}" project
    </h1>
    <ElButton
      icon="plus"
      :disabled="isLoading"
      @click="openEditTaskDialog()"
    >
      Add new task
    </ElButton>
  </div>

  <div class="project-tasks__filter-panel">
    <RouterLink to="/">
      <ElButton icon="arrow-left">Back to all projects</ElButton>
    </RouterLink>

    <ElForm label-width="auto" class="project-tasks__filter-panel__form">
      <ElFormItem label="Filter by status:">
        <TaskFilterStatus v-model="statusFilter"/>
      </ElFormItem>
      <ElFormItem label="Filter by priority:">
        <TaskFilterPriority v-model="priorityFilter"/>
      </ElFormItem>
      <ElFormItem label="Sort by field:">
        <TaskSortAttr v-model="sortAttr"/>
      </ElFormItem>
      <ElFormItem label="Sort direction:">
        <TaskSortDirection v-model="sortDirection"/>
      </ElFormItem>
    </ElForm>
  </div>
  <div
    class="project-tasks__list"
    v-loading="isLoading"
  >
    <template v-if="projectTasks.length">
      <TaskCard
        v-for="task in projectTasks"
        :title="task.title"
        :description="task.description"
        :dueDate="task.dueDate"
        :status="task.status"
        :priority="task.priority"
        @edit="openEditTaskDialog(task)"
        @remove="removeTask(task)"
      />
    </template>

    <ElEmpty v-else description="Empty"/>
  </div>

  <EditTaskDialog ref="editTaskDialogInstance"/>
</template>

<style>
.project-tasks__header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 60px;
}

.project-tasks__title {
  font-size: 28px;
  margin-right: auto;
}

.project-tasks__filter-panel {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.project-tasks__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.project-tasks__filter-panel__form {
  flex-grow: 1;
  max-width: 350px;
}
</style>
