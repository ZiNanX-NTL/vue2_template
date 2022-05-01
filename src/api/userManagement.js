import znRequest from '@/service'

export function findPeasantMessageListData(data) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return znRequest.request({
    url: '/CityManagement/zone/findPeasantMessageListData',
    method: 'post',
    data
  })
}

// 农户信息审核-查询用户列表
export function tbFindPeasantMessageListData(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-peasantmessage/findPeasantMessageListData',
    method: 'post',
    data
  })
}

// 农户信息审核-修改农药用户信息
export function updatePeasantMessage(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-peasantmessage/updatePeasantMessage',
    method: 'post',
    data
  })
}

// 农户信息审核-删除农药用户信息
export function deletPeasantMessage(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-peasantmessage/deletPeasantMessage',
    method: 'post',
    data
  })
}

// 用户管理-批量审核（驳回）
export function batchRejected(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-peasantmessage/batchRejected',
    method: 'post',
    data
  })
}

// 导出
export function messageListDataExcel(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-peasantmessage/messageListDataExcel',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 获取种植作物类型
export function houseHolder(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-pesticidesbuyrecord/houseHolder',
    method: 'post',
    data
  })
}

// 农户农药购买记录-模糊查询登记号
export function pdNoPdName(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-pesticidesbuyrecord/pdNoPdName',
    method: 'post',
    data
  })
}

// 农户农药购买记录-查询农药购买记录
export function findPesticidesbuyrecord(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-pesticidesbuyrecord/findPesticidesbuyrecord',
    method: 'post',
    data
  })
}

// 农户农药购买记录-修改农药购买记录
export function updatePesticidesbuyrecord(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-pesticidesbuyrecord/updatePesticidesbuyrecord',
    method: 'post',
    data
  })
}

// 农户农药购买记录-修改农药购买记录
export function addPesticidesbuyrecord(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-pesticidesbuyrecord/addPesticidesbuyrecord',
    method: 'post',
    data
  })
}

// 农户农药购买记录-修改农药购买记录
export function deletPurchase(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-pesticidesbuyrecord/deletPurchase',
    method: 'post',
    data
  })
}

// 获取农作物种植情况列表
export function cropPlantingList(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-tbcropplanting/cropPlantingList',
    method: 'post',
    data
  })
}

// 删除农作物种植信息
export function deletCropPlanting(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-tbcropplanting/deletCropPlanting',
    method: 'post',
    data
  })
}

// 删除农作物种植信息
export function cropNameList(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-tbcropplanting/cropNameList',
    method: 'post',
    data
  })
}

// 保存农作物种植信息
export function saveCropPlanting(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-tbcropplanting/saveCropPlanting',
    method: 'post',
    data
  })
}

// 编辑农作物种植信息
export function updataCropPlanting(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-tbcropplanting/updataCropPlanting',
    method: 'post',
    data
  })
}

// 农药使用记录审核-修改农药使用记录
export function updatePesticidesToModify(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-pesticidesusagelog/updatePesticidesToModify',
    method: 'post',
    data
  })
}

// 农药使用记录审核-修改农药使用记录
export function findPesticidesbuyuse(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-pesticidesusagelog/findPesticidesbuyrecord',
    method: 'post',
    data
  })
}

// 农药使用记录审核-添加农药使用记录
export function addPesticideApplication(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-pesticidesusagelog/addPesticideApplication',
    method: 'post',
    data
  })
}

// 查询用户区县详情
export function findTbPeasantaudituserData(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-peasantaudituser/findTbPeasantaudituserData',
    method: 'post',
    data
  })
}

// 修改或添加用户区县基本信息
export function savePeasantaudituser(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-peasantaudituser/savePeasantaudituser',
    method: 'post',
    data
  })
}

// 查询作物种类
export function findDictionarydata(data) {
  return znRequest.request({
    url: '/PeasantMessage/tb-dictionarydata/findDictionarydata',
    method: 'post',
    data
  })
}
