/* eslint-disable */
// 一般和上方查询 地图服务属性值的方法配套使用
// 点击区域高亮  --- 块儿时
// option 对象
// map 地图对象
// feature 点击地图获取到的feature对象 (要素对象包括不完整的图形对象)
const setEdge = option => {
  const redEdgeLayer = esri.layers.GraphicsLayer({ id: "edgeLayer" });
  option.map.addLayer(redEdgeLayer);

  var symbol = new esri.symbol.SimpleLineSymbol(
    esri.symbol.SimpleLineSymbol.STYLE_SOLID,
    new dojo.Color(option.color || [255, 0, 0]),
    3
  );

  // 将生成的symple放到feature里
  option.feature.setSymbol(symbol);

  // option.map.graphics.add(graphic);
  redEdgeLayer.add(option.feature);
  return redEdgeLayer;
};

export default { setEdge };
