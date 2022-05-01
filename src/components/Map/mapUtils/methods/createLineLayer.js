/* eslint-disable */
import { getPointCoordinate } from "../../utils";
/**
 *  //放线到地图上
 *  option 对象
 *  map 地图对象
 *  layerId 文字所在的layer层id
 *  list 多边形点位集合
 * layer 表示 当前点所在的层  如果没有则重新建 如有 则直接在该层上放点
 * clear-Boolean清除图层上面的图形
 **/

const createLineLayer = option => {
  const lineLayer =
    option.layer ||
    option.map.getLayer(option.layerId || "lineLayer") ||
    esri.layers.GraphicsLayer({ id: option.layerId || "lineLayer" });
  !(option.layer || option.map.getLayer(option.layerId || "lineLayer")) &&
    option.map.addLayer(lineLayer);

  // 清除所有图形
  option.clear && lineLayer.clear();

  // 多边形的符号
  const symbol = new esri.symbol.SimpleLineSymbol(
    esri.symbol.SimpleLineSymbol.STYLE_SOLID,
    new dojo.Color([255, 255, 120]),
    1
  );

  const list = [];
  for (let i = 0; i < option.list.length; i++) {
    const element = option.list[i];
    list.push(getPointCoordinate(element));
  }
  const lineJson = { paths: [list], spatialReference: { wkid: 4326 } };
  const line = new esri.geometry.Polyline(lineJson);

  const graphic = new esri.Graphic(line, symbol);
  lineLayer.add(graphic);
  return lineLayer;
};

export default { createLineLayer };
