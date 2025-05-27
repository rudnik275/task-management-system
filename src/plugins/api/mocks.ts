import type {Project, Task} from '@/types'

type ProjectTableRecord = Project & {
  id: number
}

const projectTable: ProjectTableRecord[] = []

type TaskTableRecord = Task & {
  id: number
  projectId: number
}

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
  
  projectTasks.sort((a, b) => {
    return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
  })
  
  return {
    ...project,
    dueDate: projectTasks[0]?.dueDate
  }
}

export const fetchApi = (path: string, method = 'get', body: Record<string, any> = {}) => {
  if (path === '/projects') {
    switch (method) {
      case 'get':
        return projectTable.map(serializeProject)
      case 'post': {
        const newProject = {
          id: idCounter++,
          ...body
        } as Project
        projectTable.push(newProject)
        return serializeProject(newProject)
      }
    }
  }
  
  if (routes.projectDetails.test(path)) {
    const matches = path.match(routes.projectDetails)!
    const projectId = +matches[1]
    
    switch (method) {
      case 'get':
        return serializeProject(projectTable.find(r => r.id === projectId)!)
      case 'delete': {
        const indexToRemove = projectTable.findIndex(r => r.id === projectId)
        if (indexToRemove === -1) throw new Error('Project not found')
        projectTable.splice(indexToRemove, 1)
        
        return {success: true}
      }
      case 'patch': {
        const project = projectTable.find(r => r.id === projectId)
        if (!project) throw new Error('Project not found')
        
        project.name = body.name
        return serializeProject(project)
      }
    }
  }
  
  if (routes.projectTasks.test(path)) {
    const matches = path.match(routes.projectTasks)!
    const projectId = +matches[1]
    
    switch (method) {
      case 'get':
        return Array.from(taskTable)
      case 'post':
        const newTask = {
          id: idCounter++,
          projectId,
          ...body,
          dueDate: body.dueDate || new Date().toISOString(),
        } as TaskTableRecord
        taskTable.push(newTask)
        return newTask
    }
  }
  
  if (routes.projectTaskDetails.test(path)) {
    const matches = path.match(routes.projectTaskDetails)!
    const projectId = +matches[1] // should be useful later
    const taskId = +matches[2]
    
    switch (method) {
      case 'patch': {
        const task = taskTable.find(task => task.id === taskId)
        if (!task) throw new Error('Task not found')
        
        Object.assign(task, body)
        
        return task
      }
      case 'delete': {
        const indexToRemove = taskTable.findIndex(task => task.id === taskId)
        if (indexToRemove === -1) throw new Error('Task not found')
        taskTable.splice(indexToRemove, 1)
        
        return {success: true}
      }
    }
  }
}
