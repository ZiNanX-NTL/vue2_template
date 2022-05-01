/* eslint-disable */
//获取地图服务上的信息  异步方法 需要 做一个 调用完成后 回调 将获取到的信息返回
/* --- WARNING注意：IdentifyTask,IdentifyParameters 需要 加载地图模板（loadModules）时添加 方可正常使用 不然报 underfined*/
//option 对象
//参数说明：
// map;为获取的地图 -- 必传
//event为点击地图时 返回的对象 --必传
//plantUrl 为待查询的 地图服务地址 eg:'http://59.110.28.240:6080/arcgis/rest/services/YZT/dkPlant1/MapServer' --必传
//dataIds 为待查询的 图层编码集合 为array 数组类型 eg：[88]
//map,event,plantUrl,dataIds
const identify = option => {
  return new Promise((resolve, reject) => {
    /* 你的逻辑代码 */
    var identifyTask = new esri.tasks.IdentifyTask(option.plantUrl);
    var identifyParameters = new esri.tasks.IdentifyParameters();
    identifyParameters.tolerance = 0.0000000001;
    identifyParameters.returnGeometry = true;
    identifyParameters.layerIds = option.dataIds || [];
    identifyParameters.layerOption =
      esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
    identifyParameters.geometry = option.event.mapPoint;
    identifyParameters.mapExtent = option.map.extent;
    resolve(identifyTask.execute(identifyParameters));
  });
};

export default { identify };
