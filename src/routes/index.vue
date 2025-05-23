<script lang="ts" setup>
import {useApi} from '@/plugins/api'
import type {Project} from '@/types'
import EditProjectDialog from '@/components/EditProjectDialog.vue'
import {ElMessageBox} from 'element-plus'

const projects = ref<Project[]>([])

// Load
const api = useApi()
const isLoading = ref(false)
const loadProjects = async () => {
  try {
    isLoading.value = true
    projects.value = await api.get('/projects')
  } finally {
    isLoading.value = false
  }
}
loadProjects()

// Open
const router = useRouter()
const handleClickRow = (row: Project) => router.push(`/projects/${row.id}`)

// Edit
const editProjectDialogInstance = ref<InstanceType<typeof EditProjectDialog>>()
const openEditProjectDialog = async (project?: Project) => {
  try {
    await editProjectDialogInstance.value!.open(project)
    await loadProjects()
  } catch {
    // in case need to do something on cancel
  }
}

// Remove
const removeProject = async (row: Project) => {
  try {
    await ElMessageBox.confirm(
      `Project "${row.name}" will be removed permanently`,
      {
        confirmButtonText: 'Remove',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    await api.delete(`/projects/${row.id}`)
    await loadProjects()
  } catch {
    // in case need to do something on cancel
  }
}
</script>

<template>
  <div class="projects__header">
    <h1 class="projects__title">
      Projects
    </h1>
    <ElButton
      icon="plus"
      :disabled="isLoading"
      @click="openEditProjectDialog()"
    >
      Add new project
    </ElButton>
  </div>

  <!-- TODO: fix update (rerender) table on change -->
  <pre>{{ projects }}</pre>
  <ElTable
    :data="projects"
    v-loading="isLoading"
    class="projects__table"
    @row-click="handleClickRow"
  >
    <ElTableColumn
      width="160"
      v-slot="{row}"
    >
      <ElButtonGroup>
        <ElButton icon="edit" @click.stop="openEditProjectDialog(row)"/>
        <ElButton icon="delete" @click.stop="removeProject(row)"/>
      </ElButtonGroup>
    </ElTableColumn>
    <ElTableColumn prop="name" label="Name"/>
    <ElTableColumn prop="dueDate" label="Due date" width="180"/>
  </ElTable>

  <EditProjectDialog ref="editProjectDialogInstance"/>
</template>

<style>
.projects__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 60px;
}

.projects__title {
  font-size: 32px;
}

.projects__table td {
  cursor: pointer;
}
</style>
