import {defineStore} from 'pinia'
import {useApi} from '@/plugins/api'
import type {Project, Task} from '@/types'

export const useTasksStore = defineStore('tasks', () => {
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
    console.log(projectTasks.value)
    isLoading.value = false
  }
  
  return {
    projectTasks,
    project,
    projectId,
    isLoading,
    prioritySort,
    statusFilter,
    loadProjectTasks
  }
})
