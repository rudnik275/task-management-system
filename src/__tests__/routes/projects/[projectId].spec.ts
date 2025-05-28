import {describe, expect, it, vi} from 'vitest'
import {createWrapper, addTask} from '@/__tests__/test-utils.ts'

describe('Tasks', () => {
  it('should create new task', async () => {
    const {wrapper} = await createWrapper()
    await addTask(wrapper, 'Task 1', 'Description for task')
    
    const card = wrapper.findAll('.el-card').find(card => card.text().includes('Task 1'))
    expect(card).toBeTruthy()
    expect(card?.text()).toContain('Description for task')
    expect(card?.text()).toContain('Status: Pending')
    expect(card?.text()).toContain('Priority: medium')
  })
  
  it('should edit task', async () => {
    const {wrapper} = await createWrapper()
    await addTask(wrapper, 'Task 1', 'Description for task')
    const card = wrapper.findAll('.el-card').find(card => card.text().includes('Task 1'))
    await card?.find('[data-test="task-edit-button"]').trigger('click')
    await wrapper.find('[data-test="input-title"]').setValue('New task name')
    await wrapper.find('[data-test="input-description"]').setValue('Updated description')
    
    // set high priority
    const priorityRadioButtons = wrapper.findAll('[data-test="priority-radio-buttons"] .el-segmented__item')
    const highPriorityButton = priorityRadioButtons.find(button => button.text().includes('High'))!
    await highPriorityButton.find('input[type="radio"]').setValue(true)
    
    // set completed status
    const statusRadioButtons = wrapper.findAll('[data-test="status-radio-buttons"] .el-segmented__item')
    const completedStatusButton = statusRadioButtons.find(button => button.text().includes('Completed'))!
    await completedStatusButton.find('input[type="radio"]').setValue(true)
    
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
    await addTask(wrapper, 'Task 1', 'Description for task')
    const card = wrapper.findAll('.el-card').find(card => card.text().includes('Task 1'))
    await card?.find('[data-test="task-remove-button"]').trigger('click')
    await vi.waitUntil(() => wrapper.find('.project-tasks__list').text().includes('Empty'))
    expect(wrapper.find('.project-tasks__list').text()).toContain('Empty')
  })
  
  it('should filter tasks', async () => {
    // await addTask(wrapper, 'Task 1', 'Description for task')
    // await addTask(wrapper, 'Task 1', 'Description for task')
    // await addTask(wrapper, 'Task 1', 'Description for task')
  })
  
  it('should sort tasks', async () => {
  
  })
})
