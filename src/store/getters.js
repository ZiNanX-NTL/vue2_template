/*
 * @Author: your name
 * @Date: 2021-07-19 10:01:33
 * @LastEditTime: 2022-06-26 14:19:27
 * @LastEditors: ZiNanX-NTL 702668400@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \hrsaas\src\store\getters.js
 */
const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,

  // tags
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,

  // user
  token: (state) => state.user.token, // 在根级的getters上 开发子模块的属性给别人看 给别人用

  name: (state) => state.user.userInfo.name, // 建立用户名称的映射
  userId: (state) => state.user.userInfo.userID, // 建立用户id的映射
  headUrl: (state) => state.user.userInfo.headUrl, // 建立用户头像的映射
  roles: (state) => state.user.userInfo.role, // 建立用户权限的映射

  // permission
  permission_routes: (state) => state.permission.routes
}
export default getters
