<script lang="ts" setup>
import {type Project, type Task} from '@/types'
import {useApi} from '@/plugins/api'
import {ElMessageBox} from 'element-plus'
import EditTaskDialog from '@/components/EditTaskDialog.vue'
import TaskCard from '@/components/TaskCard.vue'
import TaskFilterStatus from '@/components/TaskFilterStatus.vue'
import TaskSortPriority from '@/components/TaskSortPriority.vue'

const api = useApi()
const route = useRoute('/projects/[projectId]')

const projectTasks = ref<Task[]>([])
const project = ref({} as Project)
const projectId = computed(() => +route.params.projectId)
const isLoading = ref(false)
const prioritySort = ref()
const statusFilter = ref()

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
      `Task "${task.title}" will be removed permanently`,
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
      <TaskFilterStatus v-model="statusFilter"/>
      <TaskSortPriority v-model="prioritySort"/>
    </div>
  </div>
  <div
    class="project-tasks__list"
    v-loading="isLoading"
  >
    <template v-if="projectTasks.length">
      <TaskCard
        v-for="task in projectTasks"
        :task="task"
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

.project-tasks__filter-panel__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  & > * {
    width: 200px;
  }
}

.project-tasks__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
</style>
