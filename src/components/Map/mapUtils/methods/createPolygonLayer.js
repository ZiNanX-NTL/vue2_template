/* eslint-disable */

/**
 *  //放文字到地图上
 *  option 对象
 *  map 地图对象
 *  layerId 文字所在的layer层id
 *  list 多边形点位集合
 * layer 表示 当前点所在的层  如果没有则重新建 如有 则直接在该层上放点
 * clear-Boolean清除图层上面的图形
 **/

const createPolygonLayer = option => {
  const polygonLayer =
    option.layer ||
    option.map.getLayer(option.layerId || "polygonLayer") ||
    esri.layers.GraphicsLayer({ id: option.layerId || "polygonLayer" });
  !(option.layer || option.map.getLayer(option.layerId || "polygonLayer")) &&
    option.map.addLayer(polygonLayer);

  // 清除所有图形
  option.clear && polygonLayer.clear();

  // 多边形的符号
  const symbol = new esri.symbol.SimpleLineSymbol(
    esri.symbol.SimpleLineSymbol.STYLE_SOLID,
    new dojo.Color([255, 255, 255]),
    3
  );

  const polygonJson = {
    rings: [option.list],
    spatialReference: { wkid: 4326 }
  };
  const polygon = new esri.geometry.Polygon(polygonJson);

  const graphic = new esri.Graphic(polygon, symbol);
  polygonLayer.add(graphic);
  return polygonLayer;
};

export default { createPolygonLayer };
