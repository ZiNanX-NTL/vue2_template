// const merge = (...objs) =>
//   [...objs].reduce(
//     (acc, obj) =>
//       Object.keys(obj).reduce((a, k) => {
//         acc[k] = Object.prototype.hasOwnProperty.call(acc, k)
//           ? [].concat(acc[k]).concat(obj[k])
//           : obj[k]
//         return acc
//       }, {}),
//     {}
//   )

function isTrue(unKnow) {
  const toString = Object.prototype.toString
  const isArray =
    Array.isArray ||
    function(arg) {
      return toString.call(arg) === '[object Array]'
    }
  // 下面两行是不遍历对象数组的,说明不能合并对象数组
  // if (isArray(unKnow)) return true
  // return typeof unKnow !== 'object'

  // 解决
  if (isArray(unKnow) && unKnow.length > 0 && typeof unKnow[0] !== 'object') {
    return true
  } else if (isArray(unKnow) && unKnow.length > 0 && typeof unKnow[0] === 'object') {
    return false
  } else {
    return typeof unKnow !== 'object'
  }
}

function assiginObj(target = {}, sources = {}) {
  // console.log(typeof target, typeof sources, { target, sources })
  const obj = target
  if (isTrue(target) || isTrue(sources)) {
    return target || sources // 如果其中一个不是对象或者是一个数组 就返回target或sources
  }

  for (const key in sources) {
    // 如果target也存在 那就再次合并
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      obj[key] = assiginObj(target[key], sources[key])
    } else {
      // 不存在就直接添加
      obj[key] = sources[key]
    }
  }
  return obj
}

export default assiginObj
