<script lang="ts" setup>
import TaskSortDirection from '@/components/TaskSortDirection.vue'
import TaskFilterStatus from '@/components/TaskFilterStatus.vue'
import TaskSortAttr from '@/components/TaskSortAttr.vue'
import TaskFilterPriority from '@/components/TaskFilterPriority.vue'
import {useTasksStore} from '@/stores/tasks.ts'

const tasksStore = useTasksStore()
const {
  priorityFilter,
  statusFilter,
  sortAttr,
  sortDirection,
} = toRefs(tasksStore)

const appliedFiltersCount = computed(
  () => [priorityFilter.value, statusFilter.value]
    .filter(i => i.length > 0)
    .length
)
const visible = ref(false)
</script>

<template>
  <ElPopover
    trigger="click"
    placement="bottom"
    :visible="visible"
    popper-class="filter-popover"
  >
    <template #reference>
      <ElBadge :show-zero="false" :value="appliedFiltersCount" class="item">
        <ElButton @click="visible = !visible">{{ visible ? 'Hide' : 'Show' }} filters</ElButton>
      </ElBadge>
    </template>

    <div class="filter-popover__close-button-container">
      <ElButton @click="visible = false" icon="close" text/>
    </div>

    <ElFormItem label="Filter by status:">
      <TaskFilterStatus v-model="statusFilter"/>
    </ElFormItem>
    <ElFormItem label="Filter by priority:">
      <TaskFilterPriority v-model="priorityFilter"/>
    </ElFormItem>
    <ElFormItem label="Sort by field:">
      <TaskSortAttr v-model="sortAttr"/>
    </ElFormItem>
    <ElFormItem label="Sort direction:">
      <TaskSortDirection v-model="sortDirection"/>
    </ElFormItem>
  </ElPopover>
</template>

<style>
.filter-popover__close-button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.filter-popover {
  width: 100% !important;
  max-width: 400px;
}
</style>
