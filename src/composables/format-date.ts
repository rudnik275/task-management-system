export const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString() : ''
