export enum TaskPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high'
}

export enum TaskStatus {
  Pending = 'pending',
  InProgress = 'in-progress',
  Completed = 'completed'
}

export interface Task {
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: string
}
