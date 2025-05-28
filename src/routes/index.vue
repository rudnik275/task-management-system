<script lang="ts" setup>
import {useApi} from '@/plugins/api'
import type {Project} from '@/types'
import EditProjectDialog from '@/components/EditProjectDialog.vue'
import {formatDate} from '@/composables/format-date.ts'
import {useProjectsStore} from '@/stores/projects.ts'

const api = useApi()
const projectsStore = useProjectsStore()

const {
  projects,
  isLoading
} = toRefs(projectsStore)

const {loadProjects} = projectsStore

loadProjects()

// Open
const router = useRouter()
const handleClickRow = (row: Project) => router.push(`/projects/${row.id}`)

// Edit
const editProjectDialogInstance = ref<InstanceType<typeof EditProjectDialog>>()
const openEditProjectDialog = async (project?: Project) => {
  try {
    await editProjectDialogInstance.value!.open(project)
    ElMessage({
      message: project ? 'Changed' : 'Added',
      type: 'success',
      plain: true,
    })
    await loadProjects()
  } catch {
    // in case need to do something on cancel
  }
}

// Remove
const removeProject = async (project: Project) => {
  try {
    await ElMessageBox.confirm(
      `Project "${project.name}" will be removed permanently`,
      {
        confirmButtonText: 'Remove',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    await api.delete(`/projects/${project.id}`)
    ElMessage({
      message: 'Removed',
      type: 'success',
      plain: true,
    })
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
      data-test="add-new-project"
      @click="openEditProjectDialog()"
    >
      Add new project
    </ElButton>
  </div>

  <ElTable
    :data="projects"
    v-loading="isLoading"
    class="projects__table"
    data-test="table"
    @row-click="handleClickRow"
  >
    <ElTableColumn
      width="160"
      v-slot="{row}"
    >
      <ElButtonGroup>
        <ElButton
          icon="edit"
          @click.stop="openEditProjectDialog(row)"
          data-test="edit-project-button"
        />
        <ElButton
          icon="delete"
          data-test="delete-project-button"
          @click.stop="removeProject(row)"
        />
      </ElButtonGroup>
    </ElTableColumn>
    <ElTableColumn prop="name" label="Name"/>
    <ElTableColumn prop="dueDate" label="Due date" width="180" v-slot="{row}">
      {{ formatDate(row.dueDate) }}
    </ElTableColumn>
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
