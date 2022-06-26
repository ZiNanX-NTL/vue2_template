/*
 * @Author: your name
 * @Date: 2021-07-19 10:01:33
 * @LastEditTime: 2022-06-26 13:12:03
 * @LastEditors: ZiNanX-NTL 702668400@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \hrsaas\src\api\user.js
 */
import znRequest from '@/service'

export function login(data) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return znRequest.request({
    url: '/webUser/login', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'post',
    data,
    interceptors: {
      requestInterceptor(config) {
        console.log('单个请求, 请求拦截成功')
        return config
      },
      responseInterceptor(res) {
        console.log('单个请求, 响应拦截成功')
        return res
      }
    }
  })
}

// 退出登录
export function loginOut() {
  return znRequest.request({
    url: '/login/loginOut',
    method: 'post'
  })
}

/**
 *  获取用户的基本资料
 *
 * **/
export function getUserInfo() {
  return znRequest.request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 修改登录密码
export function updatePassword(data) {
  return znRequest.request({
    url: '/UserManagement/tb-web-user/updatePassword',
    method: 'post',
    data
  })
}

// export function logout() {}
