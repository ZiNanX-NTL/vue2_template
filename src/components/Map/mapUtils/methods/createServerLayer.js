/* eslint-disable */
//放置地图服务到地图上
//option 对象
//map 为获取的地图 -- 必传
//url 为地图服务地址  -- 必传
//layerArr  希望地图服务显示出来的 已知图层 []
//layerIndex  地图显示层级索引
//op 为透明度 不传默认为1 即不透明
const createServerLayer = option => {
  const mapServe = new esri.layers.ArcGISDynamicMapServiceLayer(option.url, {
    id: option.layerId
  });
  option.layerArr &&
    option.layerArr.length > 0 &&
    mapServe.setVisibleLayers(option.layerArr); //设置可见层
  mapServe.setOpacity(option.op || 1); //设置透明度

  // 显示图层内符合查询条件的内容
  if (option.wheresShow && option.wheresShow.length > 0) {
    var layerDefinitions = [];
    // layerDefinitions[0] = "LQDKDM like '640302%'"
    // layerDefinitions[5]="AREA>100000";
    for (let i = 0; i < option.wheresShow.length; i++) {
      if (option.wheresShow[i].id) {
        layerDefinitions[option.wheresShow[i].id] = option.wheresShow[i].where;
      }
    }
    mapServe.setLayerDefinitions(layerDefinitions);
  }

  option.map.addLayer(mapServe, option.layerIndex); // 添加地图服务

  return mapServe;
};

export default { createServerLayer };
