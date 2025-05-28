import axios, {type AxiosInstance} from 'axios'
import type {Plugin} from 'vue'
import {initMocks} from './mocks.ts'

export const injectionKey: InjectionKey<AxiosInstance> = Symbol()

export const ApiPlugin: Plugin = (app, options = {}) => {
  const api = axios.create({
    baseURL: '/api',
  })
  
  initMocks(api, options.delayResponse)
  
  // always returns response data
  api.interceptors.response.use(config => config.data, (error) => {
    if (error.status === 401) {
      ElMessage({
        message: 'Authorization error',
        type: 'error',
      })
    }
  })
  
  api.interceptors.request.use((config) => {
    if (localStorage.getItem('accessToken')) {
      config.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
    }
    return config
  })
  
  app.provide(injectionKey, api)
}

export const useApi = () => inject(injectionKey)!
