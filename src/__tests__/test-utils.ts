import {mount, VueWrapper} from '@vue/test-utils'
import {vi} from 'vitest'
import {router} from '@/plugins/router.ts'
import {ElMessage, ElMessageBox} from 'element-plus'
import App from '@/App.vue'
import {createPinia} from 'pinia'
import {ApiPlugin} from '@/plugins/api'

export const createWrapper = async () => {
  await router.push('/')
  await router.isReady()
  vi.spyOn(ElMessageBox, 'confirm').mockResolvedValue({} as any)
  vi.spyOn(ElMessage, 'success').mockImplementation(() => ({
    close: () => {
    }
  }))
  
  const wrapper = mount(App, {
    global: {
      plugins: [
        router,
        createPinia(),
        [ApiPlugin, {delayResponse: 0}]
      ]
    },
  })
  await vi.waitUntil(() => wrapper.find('[data-test="add-new-project"]').attributes('disabled') === undefined)
  
  return {wrapper, router}
}

export const addProject = async (wrapper: VueWrapper, name: string) => {
  await wrapper.find('[data-test="add-new-project"]').trigger('click')
  await wrapper.find('[data-test="name-input"]').setValue(name)
  await wrapper.find('[data-test="confirm"]').trigger('click')
  await vi.waitUntil(() => wrapper.find('[data-test="table"]')
    .text()
    .includes(name)
  )
}
