import axios from 'axios'
import { Loading } from 'element-ui'

const DEFAULT_LOADING = true // 所有实例默认显示loading

// *当前实例(实例化时传进来的参数影响当前实例)
class ZNRequest {
  instance
  interceptors // 当前实例拦截器对象
  loading // loading实例
  showLoading // 当前实例是否显示loading
  _showLoading // 缓存的实例化初始化showLoading

  constructor(config) {
    this.instance = axios.create(config)
    // 初始化实例属性
    this.showLoading = config.showLoading ?? DEFAULT_LOADING // 实例化时是否显示loading
    this._showLoading = config.showLoading // 缓存实例初始化showLoading
    this.interceptors = config.interceptors

    // 3.当前实例的请求拦截器使用
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    )

    // 2.所有实例请求拦截器使用
    this.instance.interceptors.request.use(
      (config) => {
        console.log('所有实例,请求拦截成功')
        if (this.showLoading) {
          this.loading = Loading.service({
            lock: true,
            text: '正在加载中...',
            background: 'rgba(0, 0, 0, 0.5)'
          })
        }
        return config
      },
      (err) => {
        console.log('所有实例,请求拦截失败')
        return err
      }
    )

    // I. 所有实例响应拦截器使用
    this.instance.interceptors.response.use(
      (res) => {
        console.log('所有实例,响应拦截成功')

        // 关闭loading
        this.loading?.close()

        const data = res.data
        // if (condition) {
        // TODO: 判断返回数据的code显示不同错误信息

        // } else {
        // TODO: 所有实例响应数据拦截处理

        // }
        return data
      },
      (err) => {
        console.log('所有实例,响应拦截失败')

        // 关闭loading
        this.loading?.close()
        // TODO: 判断不同的HttpErrorCode显示不同的错误信息
        // return err
        return Promise.reject(err)
      }
    )

    // II. 当前实例响应拦截器使用
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    )
  }

  request(config) {
    return new Promise((resolve, reject) => {
      // 1.单个请求拦截器使用
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config)
      }

      if (config.showLoading === false) this.showLoading = config.showLoading

      this.instance
        .request(config)
        .then((res) => {
          // III. 单个请求,响应拦截器使用
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res)
          }
          this.showLoading = this._showLoading ?? DEFAULT_LOADING
          resolve(res)
        })
        .catch((err) => {
          this.showLoading = this._showLoading ?? DEFAULT_LOADING
          reject(err)
        })
    })
  }
}

export default ZNRequest
