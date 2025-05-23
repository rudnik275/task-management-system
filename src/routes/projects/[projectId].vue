<script lang="ts" setup>
import {type Project, type Task, TaskStatus} from '@/types'

import {useApi} from '@/plugins/api'
import {ElMessageBox} from 'element-plus'
import EditTaskDialog from '@/components/EditTaskDialog.vue'
import TaskStatusTag from '@/components/TaskStatusTag.vue'
import {formatDate} from '@/composables/format-date.ts'

const api = useApi()
const route = useRoute('/projects/[projectId]')

const projectTasks = ref<Task[]>([])
const project = ref({} as Project)
const projectId = computed(() => +route.params.projectId)
const isLoading = ref(false)
const prioritySort = ref()
const statusFilter = ref()
const statusFilterOptions = [{
  label: 'Pending',
  value: TaskStatus.Pending
}, {
  label: 'In progress',
  value: TaskStatus.InProgress
}, {
  label: 'Completed',
  value: TaskStatus.Completed
}]
const prioritySortOptions = [{
  label: 'Low to High',
  value: 'asc'
}, {
  label: 'High to Low',
  value: 'desc'
}]

const loadProjectTasks = async () => {
  isLoading.value = true
  project.value = await api.get(`/projects/${projectId.value}`)
  projectTasks.value = await api.get(`/projects/${projectId.value}/tasks`, {
    params: {
      statusFilter: statusFilter.value,
      prioritySort: prioritySort.value
    }
  })
  isLoading.value = false
}

watch([statusFilter, prioritySort], loadProjectTasks, {immediate: true})

// Edit
const editTaskDialogInstance = ref<InstanceType<typeof EditTaskDialog>>()
const openEditTaskDialog = async (row?: Task) => {
  try {
    await editTaskDialogInstance.value!.open(projectId.value, row)
    await loadProjectTasks()
  } catch {
    // in case need to do something on cancel
  }
}

const removeTask = async (task: Task) => {
  try {
    await ElMessageBox.confirm(
      `Project "${task.title}" will be removed permanently`,
      {
        confirmButtonText: 'Remove',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    await api.delete(`/projects/${projectId.value}/tasks/${task.id}`)
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

    <div class="project-tasks__filter-panel__filters">
      <ElSelect
        v-model="statusFilter"
        placeholder="Filter by status"
        clearable
      >
        <ElOption
          v-for="{label, value} in statusFilterOptions"
          :label="label"
          :value="value"
        />
      </ElSelect>

      <ElSelect
        v-model="prioritySort"
        placeholder="Sort by priority"
        clearable
      >
        <ElOption
          v-for="{label, value} in prioritySortOptions"
          :label="label"
          :value="value"
        />
      </ElSelect>
    </div>
  </div>
  <div
    class="project-tasks__list"
    v-loading="isLoading"
  >
    <template v-if="projectTasks.length">
      <ElCard v-for="task in projectTasks">
        <template #header>

          <div class="task-card__header">
            <TaskStatusTag :status="task.status"/>
            <ElButtonGroup>
              <ElButton
                icon="edit"
                @click="openEditTaskDialog(task)"
              />
              <ElButton
                icon="delete"
                @click="removeTask(task)"
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

    <ElEmpty v-else description="Empty"/>
  </div>

  <EditTaskDialog ref="editTaskDialogInstance"/>
</template>

<style>
.project-tasks__header {
  display: flex;
  align-items: center;
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
  gap: 20px;
  margin-bottom: 20px;
}

.project-tasks__filter-panel__filters {
  display: flex;
  gap: 12px;

  & > * {
    width: 200px;
  }
}

.project-tasks__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 12px;
}

.task-card__header {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  align-items: center;
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
