/*
 * @Author: your name
 * @Date: 2021-07-19 10:01:33
 * @LastEditTime: 2022-01-13 14:20:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hrsaas\src\store\getters.js
 */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,

  token: state => state.user.token, // 在根级的getters上 开发子模块的属性给别人看 给别人用

  name: state => state.user.userInfo.area, // 建立用户名称的映射
  userId: state => state.user.userInfo.id, // 建立用户id的映射
  staffPhoto: state => state.user.userInfo.staffPhoto, // 建立用户头像的映射
  roles: state => state.user.userInfo.role // 建立用户权限的映射
}
export default getters
