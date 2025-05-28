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
  <ElContainer class="container">
    <ElMain>
      <RouterView :key="route.path"/>

      <section class="auth-token-demo">
        <h2>Demo section of auth token guard</h2>
        <ElText type="info">Removing of token should returns all mocked routes except /proects with 401 error</ElText>
        <ElButton @click="hasAuthToken = !hasAuthToken">
          {{ hasAuthToken ? 'Delete auth token' : 'Rollback auth token' }}
        </ElButton>
      </section>
    </ElMain>
  </ElContainer>
</template>

<style>
.auth-token-demo {
  margin-top: 40px;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  font-size: 20px;
  background: #e5e5e5;
}
</style>
