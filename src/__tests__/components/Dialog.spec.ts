import {describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import {nextTick} from 'vue'
import Dialog from '@/components/Dialog.vue'

describe('Dialog', () => {
  it('should open dialog and handle cancel', async () => {
    const wrapper = mount(Dialog)
    const vm = wrapper.vm as InstanceType<typeof Dialog>
    const openPromise = vm.open()
    await nextTick()
    
    expect(wrapper.find('.el-dialog').exists()).toBe(true)
    
    const cancelButton = wrapper.find('[data-test="cancel"]')
    expect(cancelButton).toBeDefined()
    
    await cancelButton!.trigger('click')
    await expect(openPromise).rejects.toBeUndefined()
  })
  
  it('should open dialog and handle confirm', async () => {
    const wrapper = mount(Dialog)
    const vm = wrapper.vm as InstanceType<typeof Dialog>
    const openPromise = vm.open()
    await nextTick()
    const dialog = wrapper.find('.el-dialog')
    
    expect(dialog.exists()).toBe(true)
    expect(dialog.isVisible()).toBe(true)
    
    const confirmButton = wrapper.find('[data-test="confirm"]')
    expect(confirmButton).toBeDefined()
    
    await confirmButton!.trigger('click')
    await expect(openPromise).resolves.toBeUndefined()
    
    expect(dialog.isVisible()).toBe(false)
  })
})
