import {createRouter, createWebHistory} from 'vue-router'
import {routes} from 'vue-router/auto-routes'

export const router = createRouter({
  history: createWebHistory(),
  routes
})

// TODO: router guards should be here
// router.beforeEach(() => {
//  // Do redirect when some request returns 401
// })
