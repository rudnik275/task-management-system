import type {AxiosInstance} from 'axios'
import {fetchApi} from './mocks.ts'

const REQUEST_TIMEOUT = 500

export const axiosMockPlugin = (instance: AxiosInstance) => {
  instance.interceptors.request.use(async (config) => {
    // synthetic request timeout
    await new Promise(res => setTimeout(res, REQUEST_TIMEOUT))
    
    // in case it's mocked request it returns some data
    const response = fetchApi(config.url!, config.method?.toLocaleLowerCase(), config.data || config.params)
    if (response) {
      // throw it to catch mocked requests in response interceptor
      throw {
        isMock: true,
        config,
        data: response,
        status: 200
      }
    }
    
    return config
  })
  
  instance.interceptors.response.use(undefined, async (error) => {
    if (error.isMock) {
      return {
        config: error.config,
        data: error.data,
        status: error.status,
        statusText: 'OK',
        headers: {},
      }
    }
    
    throw error
  })
}
