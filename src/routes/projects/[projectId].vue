<script lang="ts" setup>
import type {Project, Task} from '@/types'

import {useApi} from '@/plugins/api'
import EditTaskDialog from '@/components/EditTaskDialog.vue'

const api = useApi()
const route = useRoute('/projects/[projectId]')

const projectTasks = ref<Task[]>([])
const project = ref({} as Project)
const projectId = computed(() => +route.params.projectId)

const loadProjectTasks = async () => {
  project.value = await api.get(`/projects/${projectId.value}`)
  projectTasks.value = await api.get(`/projects/${projectId.value}/tasks`)
}
loadProjectTasks()

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

const removeTask = (row: Task) => {

}
</script>

<template>
  <div class="project-tasks__header">
    <h1 class="project-tasks__title">
      Tasks of "{{ project.name }}" project
    </h1>
    <ElButton
      icon="plus"
      @click="openEditTaskDialog()"
    >
      <!--      :disabled="isLoading"-->
      Add new task
    </ElButton>
  </div>

  <ElCard v-for="task in projectTasks">
    <template #header>
      {{ task.title }}
    </template>
    {{ task.description }}
    <pre>{{ task }}</pre>

    <template #footer>Footer content</template>
  </ElCard>

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
</style>
