/* eslint-disable */

import { getPointCoordinate } from '../../utils'
import otherUtils from './createLineLayer'

// 生成 播放小车等代表轨迹走向的图标 并调用 轨迹播放方法
// option 对象
// map 为地图对象
// path 轨迹走动的图片路径
// list 生成轨迹的list集合
// index 从第几个轨迹点开始运行
// clean清除轨迹
let timer
const playTrack = option => {
  if (option && option.list && option.list.length > 1) {
    if (option.showLine) {
      otherUtils.createLineLayer({
        map: option.map,
        layerId: 'playLinePath',
        list: option.list,
        clear: true
      })
    }
  }
  if (timer) clearTimeout(timer)
  let carLayer = option.map.getLayer('carLayer')
  let lineLayer = option.map.getLayer('lineLayer')
  let playLinePath = option.map.getLayer('playLinePath')
  // 清除轨迹
  if (option.clean) {
    lineLayer && lineLayer.clear()
    carLayer && carLayer.clear()
    playLinePath && playLinePath.clear()
    return
  }
  console.log(carLayer, lineLayer)
  if (lineLayer) {
    lineLayer.clear()
  } else {
    lineLayer = new esri.layers.GraphicsLayer({ id: 'lineLayer' })
    option.map.addLayer(lineLayer)
  }
  if (carLayer) {
    carLayer.clear()
  } else {
    carLayer = new esri.layers.GraphicsLayer({ id: 'carLayer' })
    option.map.addLayer(carLayer)
  }

  // 创建符号(图片点)
  const carSymbol = new esri.symbol.PictureMarkerSymbol(
    option.path,
    option.width || 35,
    option.height || 35
  )
  option.carSymbol = carSymbol
  // 创建符号(线)
  const lineSymbol = new esri.symbol.CartographicLineSymbol(
    esri.symbol.CartographicLineSymbol.STYLE_SOLID,
    new esri.Color([65, 105, 225]),
    3,
    esri.symbol.CartographicLineSymbol.CAP_ROUND,
    esri.symbol.CartographicLineSymbol.JOIN_ROUND,
    1
  )
  option.lineSymbol = lineSymbol

  if (option && option.list && option.list.length > 1) {
    play(option)
  }

  // 轨迹播放  并 将已播放的轨迹练成线
  // option 对象
  // map 地图对象
  // list 轨迹集合
  // index 从第几个轨迹点开始运行
  // path 轨迹走动的图片路径
  // li 轨迹运行对象的 宽  wi 高 默认35
  function play(option) {
    if (timer) clearTimeout(timer)
    // 更新点
    forCarByGraphic(option)
    // 组合两点 进行连线成轨迹线 并调用 画线方法
    if (option.index >= 1 && option.index < option.list.length) {
      forLineByGraphic(option)
    }
    option.index++
    timer = setTimeout(() => {
      // 将轨迹的两点之间 连成线
      if (option.index < option.list.length) {
        play(option)
      }
    }, 500) // 500为轨迹走动的 时间间隔 毫秒
  }

  function forCarByGraphic(option) {
    carLayer && carLayer.clear()
    const point = new esri.geometry.Point(getPointCoordinate(option.list[option.index]))
    const carGraphic = new esri.Graphic(point, option.carSymbol)
    carLayer.add(carGraphic)
  }

  // 两点或多个点之间 连成线
  // map 地图 对象
  // list 两个点 或多个点的集合 eg:[[126.xxxx0,103.xxxxx],[126.xxxxxx1,103.xxxxxxx]]
  function forLineByGraphic(option) {
    const lineGraphics = [
      getPointCoordinate(option.list[option.index]),
      getPointCoordinate(option.list[option.index - 1])
    ]
    // 轨迹 对应点的 层
    const polylineJson = {
      paths: [lineGraphics],
      spatialReference: { wkid: 4326 }
    }
    const polyline = new esri.geometry.Polyline(polylineJson)
    const lineGraphic = new esri.Graphic(polyline, option.lineSymbol)
    lineLayer.add(lineGraphic)
  }
}

export default { playTrack }
