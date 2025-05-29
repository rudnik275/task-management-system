<script lang="ts" setup>
const route = useRoute()

const hasAuthToken = ref(true)
watch(hasAuthToken, (value) => {
  if (value) {
    localStorage.setItem('accessToken', '1')
  } else {
    localStorage.removeItem('accessToken')
  }
})
onMounted(() => {
  localStorage.setItem('accessToken', '1')
})
</script>

<template>
  <ElAlert
    title="Demo section of auth token guard"
    type="info"
    description=""
    show-icon
  >
    <ElSpace direction="vertical" alignment="flex-start">
      <span>Removing of token should returns all mocked routes except /proects with 401 error</span>
      <ElButton @click="hasAuthToken = !hasAuthToken">
        {{ hasAuthToken ? 'Delete auth token' : 'Rollback auth token' }}
      </ElButton>
    </ElSpace>
  </ElAlert>
  <ElContainer class="container">
    <ElMain>
      <RouterView :key="route.path"/>
    </ElMain>
  </ElContainer>
</template>

<style>
</style>
