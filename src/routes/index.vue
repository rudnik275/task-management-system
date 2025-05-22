<script lang="ts" setup>
import {useApi} from '@/plugins/api'

const projects = ref([])

const api = useApi()
onMounted(async () => {
  projects.value = await api.get('/projects')
})
</script>

<template>
  <h1>
    Projects
  </h1>

  <ElTable>
    
  </ElTable>
  <RouterLink to="/project1">
    project1
  </RouterLink>
  <pre>{{ projects }}</pre>
</template>

<style>
</style>
