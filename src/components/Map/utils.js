// 工具
// 获取对象中的点坐标并返回
export const getPointCoordinate = someOption => {
  const x =
    someOption.longitude ||
    someOption.x ||
    someOption.X ||
    someOption.pointx ||
    someOption['经度'] ||
    someOption.JD
  const y =
    someOption.latitude ||
    someOption.y ||
    someOption.Y ||
    someOption.pointy ||
    someOption['纬度'] ||
    someOption.WD
  if (!x || !y) return
  return [parseFloat(x), parseFloat(y)]
}
