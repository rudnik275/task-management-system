<script lang="ts" setup>
import type {Task} from '@/types'

const taskList: Task[] = [{}]
</script>

<template>
  <ElBreadcrumb>
    <ElBreadcrumbItem to="/">Home</ElBreadcrumbItem>
    <ElBreadcrumbItem>project1</ElBreadcrumbItem>
  </ElBreadcrumb>

  Task list
  <ElTable :data="taskList" style="width: 100%">
    <ElTableColumn fixed="left" width="120">
      <template #default>
        <ElIcon>
          <ElIconDelete/>
        </ElIcon>
        <ElButton link type="primary" size="small">Edit</ElButton>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="date" label="Date" width="180"/>
    <ElTableColumn prop="name" label="Name" width="180"/>
    <ElTableColumn prop="address" label="Address"/>
  </ElTable>
</template>

<style>
</style>
