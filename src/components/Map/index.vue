<template>
  <div id="map" />
</template>
<script>
/* eslint-disable */
import { loadModules, setDefaultOptions, loadCss } from 'esri-loader'

export default {
  name: 'MapView',
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      setDefaultOptions({
        // version: '3.38'
        url: 'http://218.7.20.54:9006/arcgis_js_api/library/3.27/3.27/init.js'
      })
      loadCss('http://218.7.20.54:9006/arcgis_js_api/library/3.27/3.27/esri/css/esri.css')
      // loadCss('3.38')
      loadModules([
        'dojo/_base/declare',
        'esri/map',
        'esri/geometry/Extent',
        'esri/SpatialReference',
        'esri/layers/TiledMapServiceLayer',
        'esri/layers/TileInfo',
        'esri/layers/ArcGISDynamicMapServiceLayer',
        'esri/tasks/IdentifyTask',
        'esri/tasks/IdentifyParameters',
        'dojo/domReady!'
      ])
        .then(
          ([
            declare,
            Map,
            Extent,
            SpatialReference,
            TiledMapServiceLayer,
            TileInfo,
            ArcGISDynamicMapServiceLayer
          ]) => {
            const startExtent = new Extent(
              107.66042800183516,
              35.2383887783676,
              104.28303500160375,
              39.38765376928577
            )

            // 实例map-->
            this.map = new Map('map', {
              spatialReference: { wkid: 4326 }, // 设置坐标系
              logo: false, // 取消地图默认的logo
              zoom: 7, // 显示地图的级别
              maxZoom: 17, // 最大空间等级`
              minZoom: 1, // 最大空间等级`
              slider: false, // 隐藏放大缩小按钮
              extent: startExtent // 程度
            })

            // 设置鼠标在map上时的样式为手型
            this.map.setMapCursor('pointer')

            declare('TDTLayer', TiledMapServiceLayer, {
              constructor: function() {
                this.spatialReference = new SpatialReference({ wkid: 4326 })
                this.initialExtent = this.fullExtent = new Extent(
                  -180.0,
                  -90.0,
                  180.0,
                  90.0,
                  this.spatialReference
                )
                this.tileInfo = new TileInfo({
                  rows: 256,
                  cols: 256,
                  compressionQuality: 0,
                  origin: { x: -180, y: 90 },
                  spatialReference: { wkid: 4326 },
                  lods: [
                    { level: 0, resolution: 0.703125, scale: 295497593.05875 },
                    { level: 1, resolution: 0.3515625, scale: 147748796.529375 },
                    { level: 2, resolution: 0.17578125, scale: 73874398.264688 },
                    { level: 3, resolution: 0.087890625, scale: 36937199.132344 },
                    {
                      level: 4,
                      resolution: 0.0439453125,
                      scale: 18468599.566172
                    },
                    {
                      level: 5,
                      resolution: 0.02197265625,
                      scale: 9234299.783086
                    },
                    {
                      level: 6,
                      resolution: 0.010986328125,
                      scale: 4617149.891543
                    },
                    {
                      level: 7,
                      resolution: 0.0054931640625,
                      scale: 2308574.945771
                    },
                    {
                      level: 8,
                      resolution: 0.00274658203125,
                      scale: 1154287.472886
                    },
                    {
                      level: 9,
                      resolution: 0.001373291015625,
                      scale: 577143.736443
                    },
                    {
                      level: 10,
                      resolution: 0.0006866455078125,
                      scale: 288571.86822143558
                    },
                    {
                      level: 11,
                      resolution: 0.00034332275390625,
                      scale: 144285.93411071779
                    },
                    {
                      level: 12,
                      resolution: 0.000171661376953125,
                      scale: 72142.967055358895
                    },
                    {
                      level: 13,
                      resolution: 8.58306884765625e-5,
                      scale: 36071.483527679447
                    },
                    {
                      level: 14,
                      resolution: 4.291534423828125e-5,
                      scale: 18035.741763839724
                    },
                    {
                      level: 15,
                      resolution: 2.1457672119140625e-5,
                      scale: 9017.8708819198619
                    },
                    {
                      level: 16,
                      resolution: 1.0728836059570313e-5,
                      scale: 4508.9354409599309
                    },
                    {
                      level: 17,
                      resolution: 5.3644180297851563e-6,
                      scale: 2254.4677204799655
                    }
                  ]
                })
                this.loaded = true
                this.onLoad(this)
              }
            })
            // 影像地图
            declare('my.TDTImageLayer', TDTLayer, {
              getTileUrl: function(level, row, col) {
                // wmts
                return (
                  `http://t0.tianditu.com/DataServer?T=img_c` +
                  `&X=${col}` +
                  `&Y=${row}` +
                  `&L=${level * 1 + 1}` +
                  `&tk=7400080a0ffa866895a3f07b37788229`
                )
              }
            })
            // 全球地形晕渲地图服务  http://t0.tianditu.com/ter_w/
            declare('my.TerLayer', TDTLayer, {
              getTileUrl: function(level, row, col) {
                // wmts
                return (
                  'http://t0.tianditu.com/DataServer?T=ter_c&X=' +
                  col +
                  '&Y=' +
                  row +
                  '&L=' +
                  (level * 1 + 1) +
                  '&tk=7400080a0ffa866895a3f07b37788229'
                )
              }
            })
            // 全球地形中文注记服务 cta_c
            declare('my.CatLayer', TDTLayer, {
              getTileUrl: function(level, row, col) {
                // wmts
                return (
                  'http://t0.tianditu.com/DataServer?T=cta_c&X=' +
                  col +
                  '&Y=' +
                  row +
                  '&L=' +
                  (level * 1 + 1) +
                  '&tk=7400080a0ffa866895a3f07b37788229'
                )
              }
            })

            // 30米全球地表覆盖数据服务 http://glcdata.tianditu.com/glc_c/wmts
            declare('my.GlcLayer', TDTLayer, {
              getTileUrl: function(level, row, col) {
                // wmts
                return (
                  'http://glcdata.tianditu.com/DataServer?T=glc_c&X=' +
                  col +
                  '&Y=' +
                  row +
                  '&L=' +
                  (level * 1 + 1) +
                  '&tk=7400080a0ffa866895a3f07b37788229'
                )
              }
            })
            // 地名点标注
            declare('my.labLayer', TDTLayer, {
              getTileUrl: function(level, row, col) {
                // wmts
                return (
                  'http://t0.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0' +
                  '&LAYER=cva' +
                  '&STYLE=default' +
                  '&TILEMATRIXSET=c' +
                  '&TILEMATRIX=' +
                  (level * 1 + 1) +
                  '&TILEROW=' +
                  row +
                  '&TILECOL=' +
                  col +
                  '&FORMAT=tiles' +
                  '&tk=7400080a0ffa866895a3f07b37788229'
                )
              }
            })

            this.map.addLayer(new my.TDTImageLayer())

            // 添加地图边界
            this.xzqhLayer = new ArcGISDynamicMapServiceLayer(
              'http://59.110.28.240:6080/arcgis/rest/services/NXXZQ/XZQCountry/MapServer'
            )
            this.map.addLayer(this.xzqhLayer)

            const _this = this
            // 监听地图点击事件
            dojo.connect(this.map, 'onClick', function(event) {
              if (event.graphic) {
                _this.$emit('mapPointClick', event.graphic)
              } else {
                _this.$emit('mapBlockClick', event)
              }
            })
            this.$emit('getMap', this.map)
          }
        )
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>
<style scoped lang="scss">
#map {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
