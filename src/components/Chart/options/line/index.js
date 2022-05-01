import assiginObj from '../../util'

const testLine = options => {
  const defaultConfig = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }
    ]
  }

  if (!options) return defaultConfig
  const opt = assiginObj(options, defaultConfig)
  return opt
}

export default {
  testLine
}
