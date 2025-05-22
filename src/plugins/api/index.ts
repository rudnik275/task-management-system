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
  
  app.provide(injectionKey, api)
}

export const useApi = () => inject(injectionKey)!
