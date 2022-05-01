/*
 * @Author: your name
 * @Date: 2021-07-19 10:01:33
 * @LastEditTime: 2022-04-19 17:13:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hrsaas\src\settings.js
 */
module.exports = {
  title: '"掌上植保" 后台管理',

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true, // 显示logo

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in navbar
   */
  navbarLogo: true, // 显示navbarLogo

  /**
   * @type {string} defaultLayout | layout1 | horizontalLayout
   * @description 切换布局 (layout1布局时默认固定头,layout1 | horizontalLayout布局fixedHeader和sidebarLogo配置不生效)
   */
  pageLayout: 'defaultLayout'
}
