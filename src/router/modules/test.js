/*
 * @Author: your name
 * @Date: 2021-07-20 22:59:55
 * @LastEditTime: 2022-06-07 11:11:12
 * @LastEditors: ZiNanX_NTL 702668400@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \hrsaas\src\router\modules\social.js
 */
// 导出属于员工的路由规则
import Layout from '@/layout'
//  {  path: '', component: '' }
// 每个子模块 其实 都是外层是layout  组件位于layout的二级路由里面
export default {
  path: '/social', // 路径
  name: 'social', // 给路由规则加一个name
  component: Layout, // 组件
  hidden: false,
  meta: {
    title: '用户管理',
    icon: 'tree-table',
    alwaysShow: false // default:false; true:当有一个子元素时显示父级；false:当有一个子元素时,不显示父级
  },
  // 配置二级路的路由表
  children: [
    {
      path: '', // 这里当二级路由的path什么都不写的时候 表示该路由为当前二级路由的默认路由
      name: 'Social', // name必须要,为页面缓存(组件name也得存在),路由跳转都有用,首字母大写
      component: () => import('@/views/test/social'),
      // 路由元信息  其实就是存储数据的对象 可以在这里放置一些信息
      meta: {
        title: '农药用户管理', // meta属性的里面的属性 随意定义 用title在左侧导航会读取路由里的meta里面的title作为显示菜单名称
        icon: 'table',
        noCache: true, // tagView不缓存
        roles: ['admin'], // 简单的权限管理用角色字段, 复杂的权限用权限字段
        activeMenu: '/aaaa' // 要选中那个侧边栏item,如列表页跳转到详情页(设置为hidden)，如果想要还选中高亮列表页可以设置activeMenu:"列表页的链接"
      }
    },
    {
      path: '/aaaa', // 这里当二级路由的path什么都不写的时候 表示该路由为当前二级路由的默认路由
      name: 'Aaa',
      component: () => import('@/views/test/aaaa'),
      // 路由元信息  其实就是存储数据的对象 可以在这里放置一些信息
      meta: {
        title: '测试', // meta属性的里面的属性 随意定义 用title在左侧导航会读取路由里的meta里面的title作为显示菜单名称
        icon: 'table'
        // affix: true, // tagView默认显示
      }
    }
  ]
}

// 当访问地址 是 /social的时候 layout组件会显示 此时 二级路由的默认组件  也会显示
