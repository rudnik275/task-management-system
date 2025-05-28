import {describe, expect, it} from 'vitest'
import {addProject, createWrapper} from '@/__tests__/test-utils.ts'

describe('Tasks', () => {
  it('should create new task', async () => {
    const {wrapper, router} = await createWrapper()
    await addProject(wrapper, 'Project 1')
    await router.push('/projects/0')
    // click create button
    // fill dialog
    // confirm
    // await add task
    // expect
    
    // await wrapper.findAll('.el-card').find(card => card.text().includes('Task 1')).exists()
    // expect(wrapper.html()).toContain('Empty')
  })
  
  it('should edit task', () => {
  
  })
  
  it('should delete task', () => {
  
  })
  
  it('should filter tasks', () => {
  
  })
  
  it('should sort tasks', () => {
  
  })
})
