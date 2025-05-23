import {defineStore} from 'pinia'
import {useApi} from '@/plugins/api'
import type {Project} from '@/types'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
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
  
  return {
    projects,
    loadProjects,
    isLoading
  }
})
