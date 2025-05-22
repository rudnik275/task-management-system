const projects = new Map()

projects.set(1, {name: '1'})

export const fetchApi = (url: string, method = 'get') => {
  if (url === '/projects' && method === 'get') {
    return Array.from(
      projects.values()
    )
  }
}
