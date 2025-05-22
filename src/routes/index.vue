<script lang="ts" setup>
import {useApi} from '@/composables/api.ts'

const projects = ref([])

const api = useApi()
onMounted(async () => {
  projects.value = await api.get('/projects')
})
</script>

<template>
  Projects:
  <RouterLink to="/project1">
    project1
  </RouterLink>
  <pre>{{ projects }}</pre>
</template>

<style>
</style>
