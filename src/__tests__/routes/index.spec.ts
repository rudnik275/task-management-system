import {describe, expect, it, vi} from 'vitest'
import {addProject, createWrapper} from '@/__tests__/test-utils.ts'

describe('Projects', () => {
  it('should create new project', async () => {
    const {wrapper} = await createWrapper()
    await addProject(wrapper, 'Project 1')
    expect(wrapper.find('[data-test="table"]').html()).toContain('Project 1')
  })
  
  it('should update project name', async () => {
    const {wrapper} = await createWrapper()
    await addProject(wrapper, 'Project 2')
    await wrapper
      .findAll('.el-table__row')
      .find(row => row.text().includes('Project 2'))
      ?.find('[data-test="edit-project-button"]')
      .trigger('click')
    
    await wrapper.find('[data-test="name-input"]').setValue('Updated project 2')
    await wrapper.find('[data-test="confirm"]').trigger('click')
    await vi.waitUntil(() => wrapper.find('[data-test="table"]')
      .text()
      .includes('Updated project 2')
    )
    
    expect(wrapper.find('[data-test="table"]').html()).toContain('Updated project 2')
  })
  
  it('should delete project', async () => {
    const {wrapper} = await createWrapper()
    await addProject(wrapper, 'Project 3')
    
    await wrapper.find('[data-test="delete-project-button"]').trigger('click')
    
    await vi.waitUntil(() => wrapper.find('[data-test="table"]')
      .text()
      .includes('No Data')
    )
    
    expect(wrapper.find('[data-test="table"]').html()).toContain('No Data')
  })
})
