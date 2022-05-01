// 导出属于员工的路由规则
import Layout from '@/layout'
//  {  path: '', component: '' }
// 每个子模块 其实 都是外层是layout  组件位于layout的二级路由里面
export default {
  path: '/userManagement', // 路径
  name: 'userManagement', // 给路由规则加一个name
  component: Layout, // 组件
  meta: { title: '用户管理', icon: 'tree-table' },
  children: [
    {
      path: 'pesticideUserManagement',
      component: () => import('@/views/userManagement/pesticideUserManagement'),
      name: 'pesticideUserManagement',
      meta: { title: '农药用户管理', keepAlive: true, isBack: false }
    },
    {
      path: 'buyDetails/:houseHolder/:state',
      component: () => import('@/views/userManagement/buyDetails'),
      name: 'buyDetails',
      hidden: true,
      meta: { title: '购买使用详情' }
    },
    {
      path: 'pesticideUseDetails',
      component: () => import('@/views/userManagement/pesticideUseDetails'),
      name: 'pesticideUseDetails',
      hidden: true,
      meta: { title: '农药使用详情' }
    },
    {
      path: 'cropPlantingDetails',
      component: () => import('@/views/userManagement/cropPlantingDetails'),
      name: 'cropPlantingDetails',
      hidden: true,
      meta: { title: '作物种植详情' }
    },
    {
      path: 'countyBasicSituation',
      component: () => import('@/views/userManagement/countyBasicSituation'),
      name: 'countyBasicSituation',
      meta: { title: '区县基本情况' }
    },
    {
      path: 'editUserDetails',
      component: () => import('@/views/userManagement/editUserDetails'),
      name: 'editUserDetails',
      hidden: true,
      meta: { title: '编辑用户详情' }
    }
  ]
}
