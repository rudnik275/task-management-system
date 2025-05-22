export const projects = new Map()

projects.set(1, {name: '1'})

export const fetchApi = (url: string) => {
  if (url === '/projects') {
    return Array.from(
      projects.values()
    )
  }
}
