import axios, {type AxiosInstance} from 'axios'
import {axiosMockPlugin} from './axios-mock-plugin.ts'
import type {Plugin} from 'vue'

const injectionKey: InjectionKey<AxiosInstance> = Symbol()

export const ApiPlugin: Plugin = (app) => {
  const api = axios.create({
    baseURL: '/api',
  })
  
  axiosMockPlugin(api)
  
  // always returns response data
  api.interceptors.response.use(config => config.data)
  
  // TODO: accessToken should be here
  // api.interceptors.request.use((config) => {
  //   config.headers['Authorization'] = `Bearer ${accessToken}`
  //   return config
  // })
  
  app.provide(injectionKey, api)
}

export const useApi = () => inject(injectionKey)!
