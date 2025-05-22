const projects = new Map()

let idCounter = 0

const newProject = {id: idCounter++, name: 'first project 123'}
projects.set(newProject.id, newProject)

const projectDetailsRegexp = new RegExp('^/projects/(\\d+)$')

export const fetchApi = (url: string, method = 'get', data: Record<string, any> = {}) => {
  // CRUD projects
  if (url === '/projects') {
    switch (method) {
      case 'get':
        return Array.from(
          projects.values()
        )
      case 'post': {
        const newProject = {
          id: idCounter++,
          ...data
        }
        projects.set(newProject.id, newProject)
        return newProject
      }
    }
  }
  
  // CRUD one project
  if (projectDetailsRegexp.test(url)) {
    const pathItems = url
      .split('/')
      .filter(Boolean) // remove first empty item because it starts with /
    
    const projectId = +pathItems[1]
    switch (method) {
      case 'get':
        return projects.get(projectId)
      case 'delete': {
        projects.delete(+projectId)
        return {
          success: true
        }
      }
      case 'patch': {
        projects.get(+projectId).name = data.name
        return projects.get(+projectId)
      }
    }
  }
}
