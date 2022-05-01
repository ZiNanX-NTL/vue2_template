/* eslint-disable */

/**
 *  //放文字到地图上
 *  option 对象
 *  text 放在地图上的文字
 *  center 中心点组成的point
 *  map 地图对象
 *  layerId 文字所在的layer层id
 *  layer 表示 当前点所在的层  如果没有则重新建 如有 则直接在该层上放点
 *  clear-Boolean清除图层上面的图形
 * attr 点位属性
 *  后面会完善譬如 传递 字体大小 字体颜色 文字上放的 内容 等
 * fontStyle : {
 *    fontSize
 * }
 **/
const createTextLayer = option => {
  const textLayer =
    option.layer ||
    option.map.getLayer(option.layerId || 'textLayer') ||
    esri.layers.GraphicsLayer({ id: option.layerId || 'textLayer' })
  !(option.layer || option.map.getLayer(option.layerId || 'textLayer')) &&
    option.map.addLayer(textLayer)

  // 清除所有图形
  option.clear && gpsLayer.clear()

  const font = new esri.symbol.Font(
    option.fontStyle?.fontSize || '24px',
    esri.symbol.Font.STYLE_NORMAL,
    esri.symbol.Font.WEIGHT_BOLD,
    esri.symbol.Font.WEIGHT_BOLDER
  )

  const textSymbol = new esri.symbol.TextSymbol(option.text, font, new esri.Color([255, 255, 255]))

  const textGraphic = new esri.Graphic(option.center, textSymbol, option.attr)
  textLayer.add(textGraphic)

  return textLayer
}

export default { createTextLayer }
