import {defineStore} from 'pinia'
import {useApi} from '@/plugins/api'
import type {Project, Task} from '@/types'
import {TaskPriority, TaskStatus} from '@/types'

export const useTasksStore = defineStore('tasks', () => {
  const api = useApi()
  const route = useRoute('/projects/[projectId]')
  
  const projectTasksData = ref<Task[]>([])
  const project = ref({} as Project)
  const projectId = computed(() => +route.params.projectId)
  const isLoading = ref(false)
  const priorityFilter = ref<TaskPriority[]>([])
  const statusFilter = ref<TaskStatus[]>([])
  const sortAttr = ref<'priority' | 'status' | 'dueDate'>('dueDate')
  const sortDirection = ref<string>('asc')
  
  const projectTasks = computed(() => {
    let filteredTable = Array.from(projectTasksData.value)
    
    // in case filter applied then mutate array copy
    if (priorityFilter.value.length) {
      filteredTable = filteredTable.filter(task => priorityFilter.value.includes(task.priority))
    }
    if (statusFilter.value.length) {
      filteredTable = filteredTable.filter(task => statusFilter.value.includes(task.status))
    }
    
    filteredTable.sort((a, b) => {
      const compareFunctions = {
        dueDate: (task: Task) => task.dueDate ? new Date(task.dueDate).getTime() : -Infinity,
        status: (task: Task) => Object.values(TaskStatus).indexOf(task.status),
        priority: (task: Task) => Object.values(TaskPriority).indexOf(task.priority),
      } as const
      
      const getSortValue = compareFunctions[sortAttr.value]
      const aValue = getSortValue(a)
      const bValue = getSortValue(b)
      
      return sortDirection.value === 'asc'
        ? aValue - bValue
        : bValue - aValue
    })
    
    return filteredTable
  })
  
  const loadProjectTasks = async () => {
    isLoading.value = true
    project.value = await api.get(`/projects/${projectId.value}`)
    projectTasksData.value = await api.get(`/projects/${projectId.value}/tasks`)
    isLoading.value = false
  }
  
  return {
    projectTasks,
    project,
    projectId,
    isLoading,
    statusFilter,
    priorityFilter,
    sortAttr,
    sortDirection,
    loadProjectTasks
  }
})
