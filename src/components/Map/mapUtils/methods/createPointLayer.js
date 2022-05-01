/* eslint-disable */

import { getPointCoordinate } from '../../utils'
// 地图打点  -- 图片
// option 对象
// map 传递过来的地图
// path为传递过来的 图片地址
// list 为 经纬度集合 [x: y:  attr: ,x: y: attr: ]
// dia 图片大小 默认18  li 为长   wi为宽
// list中的 attr 需放在点上的内容
// layer 表示 当前点所在的层  如果没有则重新建 如有 则直接在该层上放点
// clear-Boolean清除图层上面的图形

const createPointLayer = option => {
  if (option.map && option.list && option.list.length >= 0) {
    const gpsLayer =
      option.layer ||
      option.map.getLayer(option.layerId || 'gpsLayer') ||
      esri.layers.GraphicsLayer({ id: option.layerId || 'gpsLayer' })
    !(option.layer || option.map.getLayer(option.layerId || 'gpsLayer')) &&
      option.map.addLayer(gpsLayer)

    // 清除所有图形
    option.clear && gpsLayer.clear()

    for (let i = 0; i < option.list.length; i++) {
      const pointCoordinate = getPointCoordinate(option.list[i])
      if (pointCoordinate) {
        const symbol = new esri.symbol.PictureMarkerSymbol(
          option.path || option.pathFn(option.list[i]),
          option.height || 18,
          option.width || 18
        )
        let point = new esri.geometry.Point(pointCoordinate)
        option.offset && symbol.setOffset(option.offset.x, option.offset.y)
        const graphic = new esri.Graphic(point, symbol, option.list[i] || {})
        option.otherFn && option.otherFn(point, i, option.list[i]) // 附加操作
        gpsLayer.add(graphic)
      }
    }
    return gpsLayer
  }
}

export default { createPointLayer }
