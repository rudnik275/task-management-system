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
  api.interceptors.response.use(config => config.data)
  
  // TODO: accessToken should be here
  // api.interceptors.request.use((config) => {
  //   config.headers['Authorization'] = `Bearer ${accessToken}`
  //   return config
  // })
  
  app.provide(injectionKey, api)
}

export const useApi = () => inject(injectionKey)!
