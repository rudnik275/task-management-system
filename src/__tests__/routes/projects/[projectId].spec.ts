import {describe, expect, it, vi} from 'vitest'
import {addProject, addTask, createWrapper} from '@/__tests__/test-utils.ts'
import {router} from '@/plugins/router.ts'
import {TaskPriority, TaskStatus} from '@/types'

describe('Tasks', () => {
  it('should create new task', async () => {
    const {wrapper} = await createWrapper()
    await addProject(wrapper, 'Project')
    await router.push('/projects/0')
    await addTask(wrapper, {
      title: 'Task 1',
      description: 'Description for task'
    })
    
    const card = wrapper.findAll('.el-card').find(card => card.text().includes('Task 1'))
    expect(card).toBeTruthy()
    expect(card?.text()).toContain('Description for task')
    expect(card?.text()).toContain('Status: Pending')
    expect(card?.text()).toContain('Priority: medium')
  })
  
  it('should edit task', async () => {
    const {wrapper} = await createWrapper()
    await addProject(wrapper, 'Project')
    await router.push('/projects/0')
    await addTask(wrapper, {
      title: 'Task 1',
      description: 'Description for task'
    })
    const card = wrapper.findAll('.el-card').find(card => card.text().includes('Task 1'))
    await card?.find('[data-test="task-edit-button"]').trigger('click')
    await wrapper.find('[data-test="input-title"]').setValue('New task name')
    await wrapper.find('[data-test="input-description"]').setValue('Updated description')
    await wrapper.findComponent('[data-test="priority-radio-buttons"]').setValue('high')
    await wrapper.findComponent('[data-test="status-radio-buttons"]').setValue('completed')
    await wrapper.find('[data-test="confirm"]').trigger('click')
    await vi.waitUntil(() => wrapper
      .findAll('.el-card')
      .some(
        card => card.text().includes('New task name')
      )
    )
    
    const updatedCard = wrapper.findAll('.el-card').find(card => card.text().includes('New task name'))
    expect(updatedCard).toBeTruthy()
    expect(updatedCard?.text()).toContain('Updated description')
    expect(updatedCard?.text()).toContain('Status: Completed')
    expect(updatedCard?.text()).toContain('Priority: high')
  })
  
  it('should delete task', async () => {
    const {wrapper} = await createWrapper()
    await addProject(wrapper, 'Project')
    await router.push('/projects/0')
    await addTask(wrapper, {
      title: 'Task 1',
      description: 'Description for task'
    })
    const card = wrapper.findAll('.el-card').find(card => card.text().includes('Task 1'))
    await card?.find('[data-test="task-remove-button"]').trigger('click')
    await vi.waitUntil(() => wrapper.find('.project-tasks__list').text().includes('Empty'))
    expect(wrapper.find('.project-tasks__list').text()).toContain('Empty')
  })
  
  it('should filter tasks by status', async () => {
    const {wrapper} = await createWrapper()
    await addProject(wrapper, 'Project')
    await router.push('/projects/0')
    await addTask(wrapper, {
      title: 'Task 1',
      status: TaskStatus.Pending
    })
    await addTask(wrapper, {
      title: 'Task 2',
      status: TaskStatus.InProgress
    })
    await addTask(wrapper, {
      title: 'Task 3',
      status: TaskStatus.Completed
    })
    
    await wrapper.find('[data-test="tasks-filter-button"]').trigger('click')
    await wrapper.findComponent('[data-test="tasks-filter-status-select"]').setValue(['in-progress'])
    
    expect(wrapper.findAll('.el-card')).toHaveLength(1)
    expect(wrapper.find('.el-card').text()).toContain('Task 2')
  })
  
  it('should filter tasks by priority', async () => {
    const {wrapper} = await createWrapper()
    await addProject(wrapper, 'Project')
    await router.push('/projects/0')
    await addTask(wrapper, {
      title: 'Task 1',
      priority: TaskPriority.Low,
    })
    await addTask(wrapper, {
      title: 'Task 2',
      priority: TaskPriority.Medium,
    })
    await addTask(wrapper, {
      title: 'Task 3',
      priority: TaskPriority.High,
    })
    
    await wrapper.find('[data-test="tasks-filter-button"]').trigger('click')
    await wrapper.findComponent('[data-test="tasks-filter-priority-select"]').setValue(['high'])
    
    expect(wrapper.findAll('.el-card')).toHaveLength(1)
    expect(wrapper.find('.el-card').text()).toContain('Task 3')
  })
  
  it('should sort tasks', async () => {
    const {wrapper} = await createWrapper()
    await addProject(wrapper, 'Project')
    await router.push('/projects/0')
    await addTask(wrapper, {
      title: 'Task 1',
      priority: TaskPriority.Medium,
    })
    await addTask(wrapper, {
      title: 'Task 2',
      priority: TaskPriority.Low,
    })
    await addTask(wrapper, {
      title: 'Task 3',
      priority: TaskPriority.High,
    })
    
    await wrapper.find('[data-test="tasks-filter-button"]').trigger('click')
    await wrapper.findComponent('[data-test="tasks-sort-field-select"]').setValue('priority')
    
    expect(
      wrapper
        .findAll('.el-card .task-card__title')
        .map(card => card.text())
    ).toStrictEqual(['Task 2', 'Task 1', 'Task 3'])
    
    await wrapper.findComponent('[data-test="tasks-sort-direction-select"]').setValue('desc')
    
    expect(
      wrapper
        .findAll('.el-card .task-card__title')
        .map(card => card.text())
    ).toStrictEqual(['Task 3', 'Task 1', 'Task 2'])
  })
})
