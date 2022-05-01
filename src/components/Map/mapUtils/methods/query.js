/* eslint-disable */
/**
 * 按条件查询 地图服务
 * option 对象
 * where条件
 * url 带层级的 url
 * id 待查询的层编码
 * */

const query = option => {
  // option.url = 'http://59.110.28.240:6080/arcgis/rest/services/lqhd/lqdkQBDK/MapServer/0'
  // option.where =
  //   "JYZTLX = '05' and LQDKDM like '640302%'"
  // 获取地图服务的的 initialExtent
  return new Promise((resolve, reject) => {
    var queryTask = new esri.tasks.QueryTask(
      option.url + option.id ? `/${option.id}` : ``
    );
    var query = new esri.tasks.Query();
    query.where = option.where; // 查询的where子句

    query.outFields = ["*"]; // 要包含在FeatureSet中的属性字段。
    query.outSpatialReference = {
      // query参数--返回集合空间的参考
      wkid: option.outSpatialReference || 4326
    };
    query.returnGeometry = true; // 如果为“true”，则FeatureSet中的每个要素都包含几何。
    resolve(queryTask.execute(query));
  });
};

export default { query };
