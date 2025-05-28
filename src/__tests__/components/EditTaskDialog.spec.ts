import {describe, expect, it, vi} from 'vitest'
import {mount} from '@vue/test-utils'
import {nextTick} from 'vue'
import EditTaskDialog from '@/components/EditTaskDialog.vue'
import {injectionKey as apiInjectionKey} from '@/plugins/api'
import {TaskPriority, TaskStatus} from '@/types'

describe('EditTaskDialog', () => {
  const createWrapper = () => {
    const postMock = vi.fn().mockResolvedValue({})
    const wrapper = mount(EditTaskDialog, {
      global: {
        provide: {
          [apiInjectionKey]: {
            post: postMock
          }
        }
      }
    })
    const vm = wrapper.vm as InstanceType<typeof EditTaskDialog>
    
    return {wrapper, postMock, vm}
  }
  
  it('should create new task', async () => {
    const {wrapper, vm, postMock} = createWrapper()
    const projectId = 42
    
    const openPromise = vm.open(projectId)
    await nextTick()
    
    await wrapper.find('[data-test="priority-radio-buttons"] .el-segmented__item').trigger('click')
    await wrapper.find('[data-test="status-radio-buttons"] .el-segmented__item').trigger('click')
    await wrapper.find('input[data-test="input-title"]').setValue('Task title')
    await wrapper.find('textarea[data-test="input-description"]').setValue('Description')
    
    const confirmButton = wrapper.findAll('button').find(btn => btn.text() === 'Confirm')
    expect(confirmButton).toBeDefined()
    await confirmButton!.trigger('click')
    
    await expect(openPromise).resolves.toBeUndefined()
    
    expect(postMock).toHaveBeenCalledWith(`/projects/42/tasks`, expect.objectContaining({
      title: 'Task title',
      description: 'Description',
      dueDate: '',
      priority: TaskPriority.Medium,
      status: TaskStatus.Pending
    }))
  })
})
