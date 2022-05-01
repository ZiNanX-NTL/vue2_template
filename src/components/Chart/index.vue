<template>
  <div ref="chart" :style="style" />
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'ChartView',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartOption: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    style() {
      return {
        width: this.width,
        height: this.height
      }
    }
  },
  watch: {
    chartOption: {
      deep: true,
      handler(newVal) {
        this.setOptions(newVal)
      }
    }
  },
  mounted() {
    this.initChart(this.$el)
    if (this.autoResize) {
      window.addEventListener('resize', this.resizeHandler)
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.resizeHandler)
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    resizeHandler() {
      this.chart.resize()
    },
    initChart() {
      this.chart = echarts.init(this.$el)
      this.chart.setOption(this.chartOption)
      this.chart.on('click', this.handleClick)
    },
    setOptions(option) {
      this.clearChart()
      this.resizeHandler()
      if (this.chart) {
        this.chart.setOption(option)
      }
    },
    clearChart() {
      this.chart && this.chart.clear()
    },
    handleClick(params) {
      this.$emit('click', params)
    },
    refresh() {
      this.setOptions(this.chartOption)
    }
  }
}
</script>

<style lang="scss" scoped></style>
