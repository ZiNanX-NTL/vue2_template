import ZNRequest from '../request'
import { BASE_URL, TIMEOUT } from './config'

import router from '@/router'
import store from '@/store'
import qs from 'qs'
import { Message } from 'element-ui'

import { getTimeStamp } from '@/utils/auth'

const TimeOut = 60 * 60 // 定义超时时间(s)

const znRequest = new ZNRequest({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  interceptors: {
    requestInterceptor(config) {
      console.log('单个实例, 请求拦截成功')
      // TODO: 该实例所有请求可以携带token
      // let token = '' // 获取token
      // if (token) config.headers.Authorization = `Bearer ${token}`
      config.data = qs.stringify(config.data)
      // 在这个位置可能需要统一的去注入token
      if (store.getters.token && store.getters.token !== 'undefined') {
        // 只有在有token的情况下 才有必要去检查时间戳是否超时
        if (IsCheckTimeOut()) {
          // 如果它为true表示 过期了
          // token没用了 因为超时了
          store.dispatch('user/logout') // 登出操作
          // 跳转到登录页
          router.push('/login')
          Message.error('token超时了')
          return Promise.reject(new Error('token超时了'))
        }
        console.log(config)
        // 如果token存在 注入token
        // config.headers['Authorization'] = `Bearer ${store.getters.token}`
      }
      return config
    },
    responseInterceptor(res) {
      console.log('单个实例, 响应拦截成功')
      // axios默认加了一层data
      const { success, Code, status, Desc, Data } = res
      //   要根据success的成功与否决定下面的操作
      if (success === '0' || Code === '0' || status === '0') {
        return Data
      } else {
        // 业务已经错误了 不进then 进catch
        Message.error(Desc) // 提示错误消息
        return Promise.reject(new Error(Desc))
      }
    },
    responseInterceptorCatch(err) {
      console.log('当前实例,响应拦截失败')
      return Promise.reject(err)
    }
  }
})

// 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}

export default znRequest
