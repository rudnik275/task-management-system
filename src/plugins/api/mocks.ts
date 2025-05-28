import {type Project, type Task, TaskPriority, TaskStatus} from '@/types'
import type {AxiosInstance} from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'

type ProjectTableRecord = Project & {
  id: number
}

type TaskTableRecord = Task & {
  id: number
  projectId: number
}

export const initMocks = (api: AxiosInstance, delayResponse = 500) => {
  // @ts-expect-error: because AxiosMockAdapter and current axios in project has different versions
  const mock = new AxiosMockAdapter(api, {delayResponse})
  
  const projectTable: ProjectTableRecord[] = []
  const taskTable: TaskTableRecord[] = []
  
  let idCounter = 0
  
  const routes = {
    projectDetails: new RegExp('^/projects/(\\d+)$'),
    projectTasks: new RegExp('^/projects/(\\d+)/tasks$'),
    projectTaskDetails: new RegExp('^/projects/(\\d+)/tasks/(\\d+)$'),
  } as const
  
  const serializeProject = (project: ProjectTableRecord) => {
    const projectTasks = taskTable
      .filter(task => task.projectId === project.id)
      .filter(task => task.dueDate)
    
    projectTasks.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
    
    return {
      ...project,
      dueDate: projectTasks[0]?.dueDate
    }
  }
  
  mock.onGet('/projects').reply(() => [200, projectTable.map(serializeProject)])
  mock.onPost('/projects').reply(({data}) => {
    const newProject = {
      id: idCounter++,
      ...JSON.parse(data)
    } as Project
    projectTable.push(newProject)
    return [200, serializeProject(newProject)]
  })
  
  mock.onAny(routes.projectDetails).reply(({url, method, data}) => {
    const matches = url!.match(routes.projectDetails)!
    const projectId = +matches[1]
    
    switch (method) {
      case 'get':
        return [200, serializeProject(projectTable.find(r => r.id === projectId)!)]
      case 'delete': {
        const indexToRemove = projectTable.findIndex(r => r.id === projectId)
        if (indexToRemove === -1) throw new Error('Project not found')
        projectTable.splice(indexToRemove, 1)
        
        return [200]
      }
      case 'patch': {
        const project = projectTable.find(r => r.id === projectId)
        if (!project) throw new Error('Project not found')
        
        project.name = JSON.parse(data).name
        return [200, serializeProject(project)]
      }
    }
    
    return [404]
  })
  
  mock.onAny(routes.projectTasks).reply(({url, method, data}) => {
    const matches = url!.match(routes.projectTasks)!
    const projectId = +matches[1]
    
    switch (method) {
      case 'get':
        return [200, Array.from(taskTable)]
      case 'post':
        const newTask = {
          id: idCounter++,
          projectId,
          ...JSON.parse(data),
          dueDate: JSON.parse(data).dueDate || new Date().toISOString(),
        } as TaskTableRecord
        taskTable.push(newTask)
        return [200, newTask]
    }
    
    return [404]
  })
  
  mock.onAny(routes.projectTaskDetails).reply(({url, method, data}) => {
    const matches = url!.match(routes.projectTaskDetails)!
    const projectId = +matches[1] // should be useful later
    const taskId = +matches[2]
    
    switch (method) {
      case 'patch': {
        const task = taskTable.find(task => task.id === taskId)
        if (!task) throw new Error('Task not found')
        
        Object.assign(task, JSON.parse(data))
        
        return [200, task]
      }
      case 'delete': {
        const indexToRemove = taskTable.findIndex(task => task.id === taskId)
        if (indexToRemove === -1) throw new Error('Task not found')
        taskTable.splice(indexToRemove, 1)
        
        return [200]
      }
    }
    
    return [404]
  })
}
