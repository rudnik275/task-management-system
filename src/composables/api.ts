import axios from 'axios'
import {axiosMockPlugin} from './axios-mock-plugin.ts'

export const useApi = () => {
  const api = axios.create({
    baseURL: '/api',
  })
  
  axiosMockPlugin(api)
  
  // always returns response data
  api.interceptors.response.use(config => config.data)
  
  return api
}
