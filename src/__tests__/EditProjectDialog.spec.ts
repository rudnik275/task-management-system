import {describe, expect, it, vi} from 'vitest'
import {mount} from '@vue/test-utils'
import {nextTick} from 'vue'
import EditProjectDialog from '@/components/EditProjectDialog.vue'
import {injectionKey as apiInjectionKey} from '@/plugins/api'
import type {Project} from '@/types'

describe('EditProjectDialog', () => {
  const createWrapper = () => {
    const patchMock = vi.fn().mockResolvedValue({})
    const wrapper = mount(EditProjectDialog, {
      global: {
        provide: {
          [apiInjectionKey]: {
            patch: patchMock,
          }
        }
      }
    })
    const vm = wrapper.vm as InstanceType<typeof EditProjectDialog>
    
    return {wrapper, patchMock, vm}
  }
  
  it('should render initial project name in input', async () => {
    const {wrapper, vm} = createWrapper()
    const project = {id: 1, name: 'Test Project'} as Project
    
    vm.open(project)
    await nextTick()
    
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.element.value).toBe('Test Project')
  })
  
  it('should update input value on type', async () => {
    const {wrapper, vm} = createWrapper()
    
    const project = {id: 1, name: 'Test Project'} as Project
    vm.open(project)
    await nextTick()
    
    const input = wrapper.find('input')
    await input.setValue('Changed Test Project')
    
    expect(input.element.value).toBe('Changed Test Project')
  })
  
  it('should send updated data to correct api endpoint', async () => {
    const {wrapper, patchMock, vm} = createWrapper()
    
    const project = {id: 1, name: 'Test Project'} as Project
    const openPromise = vm.open(project)
    await nextTick()
    
    const input = wrapper.find('input')
    await input.setValue('Changed Test Project')
    
    const confirmButton = wrapper.findAll('button').find(btn => btn.text() === 'Confirm')
    expect(confirmButton).toBeDefined()
    await confirmButton!.trigger('click')
    
    await expect(openPromise).resolves.toBeUndefined()
    expect(patchMock).toHaveBeenCalledWith('/projects/1', {
      id: 1,
      name: 'Changed Test Project'
    })
  })
})
