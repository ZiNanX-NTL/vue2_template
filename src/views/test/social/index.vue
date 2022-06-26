<template>
  <div class="social-container">
    <div class="app-container">
      <chart-view v-if="false" class="chart-content" :chart-option="chartOpt" :auto-resize="true" />

      <search-form v-if="false" v-model="formData" :form-options="formOptions" :inline="true" />
      <!-- <search-form
        v-if="true"
        :form-options="formOptions"
        :inline="true"
        @watchFormData="getFormData"
      /> -->

      <div
        v-if="true"
        style="width: 100%; height: 800px; position: relative; border-radius: 8px; overflow: hidden"
      >
        <map-view @getMap="getMap" @mapBlockClick="mapBlockClick" @mapPointClick="mapPointClick" />
      </div>
      <!-- <div style="height: 250px"> -->
      <zn-table
        v-if="false"
        :table-data="tableData"
        :table-head="tableHead"
        :page-info="pageInfo"
        :prefix="'c'"
        @page-change="handlePageChange"
      >
        <template #header>
          <el-button size="small" type="primary" @click="handleAdd"> 新增 </el-button>
        </template>
        <template #name="{ row }">
          {{ row.name === '春小麦' ? 'bb' : row.name }}
        </template>
        <template #handler="{ row }">
          <el-button
            size="small"
            type="text"
            icon="el-icon-edit"
            @click="handleOperate(row, $event)"
          >
            修改
          </el-button>
        </template>
      </zn-table>
      <!-- </div> -->
      <!-- <el-button style="position: absolute; top: 0; right:0; z-index: 300" @click="play">
        播放
      </el-button> -->
      <el-button
        v-if="true"
        style="position: absolute; top: 50%; right: 0; z-index: 300"
        @click="extent"
      >
        居中范围
      </el-button>
      <!-- v-permission="[1]" -->
      <el-button
        v-if="true"
        style="position: absolute; top: 40%; right: 0; z-index: 300"
        @click="check"
      >
        查看
      </el-button>
    </div>
    <zn-model
      ref="ZnModel"
      v-model="modelForm"
      :form-options="modelConfig"
      :model-default-info="modelDefaultInfo"
      @confirm="handleConfirm"
    />

    <el-drawer title="我是标题" :visible.sync="drawer" direction="rtl">
      <zn-descriptions title="用户" :descriptions="descriptions" :header-params="headerParams">
        <template #remark="{ content }">
          <el-tag size="small">{{ content }}</el-tag>
        </template>
      </zn-descriptions>
    </el-drawer>
  </div>
</template>

<script>
import SearchForm from '@/components/SearchForm/index.vue'
import ZnTable from '@/components/ZnTable/index.vue'
import ZnModel from '@/components/ZnModel/index.vue'
import ZnDescriptions from '@/components/ZnDescriptions/index.vue'

import modelConfig from './config/modelConfig.js'
import paramsConfig from './config/paramsConfig.js'
import searchFormConfig from './config/searchFormConfig.js'
import tableHeadConfig from './config/tableHeadConfig.js'

import MapView from '@/components/Map/index.vue'
// import mapLayer from '@/components/Map/mapLayer'
import map from '@/components/Map/mapUtils'
// import { createPointLayer } from '@/components/Map/mapUtils'
import pointList from '@/api/constant/testPoint'
// import permission from '@/directives/permission/index'

export default {
  name: 'Social',
  components: {
    SearchForm,
    ZnTable,
    ZnModel,
    ZnDescriptions,
    MapView
  },
  data() {
    return {
      descriptions: {
        name: 'kooriookami',
        phone: '18100000000',
        address: '苏州市',
        remark: '学校',
        contactAddress: '江苏省苏州市吴中区吴中大道 1188 号'
      },

      headerParams: paramsConfig,

      chartOpt: {},
      formData: {},
      modelForm: {},
      modelDefaultInfo: {},
      formOptions: searchFormConfig,

      modelConfig: modelConfig,

      tableHead: tableHeadConfig,

      tableData: [
        {
          area: 1.49,
          dosage: 217.93,
          useCost: 32.13,
          museCost: 21.62,
          name: '春小麦',
          nhs: 48,
          yycs: 70,
          pjjl: 1.46,
          allcb: 1680.0902,
          alljl: 113.95,
          muDosage: 146.63
        },
        {
          area: 22.09,
          dosage: 5484.25,
          useCost: 311.23,
          museCost: 14.09,
          name: '大豆',
          nhs: 839,
          yycs: 2213,
          pjjl: 2.64,
          allcb: 83950.0517,
          alljl: 14795.23,
          muDosage: 248.32
        },
        {
          area: 0.07,
          dosage: 13.73,
          useCost: 2.59,
          museCost: 35.75,
          name: '瓜果',
          nhs: 8,
          yycs: 26,
          pjjl: 3.25,
          allcb: 2089.23,
          alljl: 110.67,
          muDosage: 189.38
        },
        {
          area: 0.33,
          dosage: 109.31,
          useCost: 5.08,
          museCost: 15.33,
          name: '经济作物',
          nhs: 33,
          yycs: 72,
          pjjl: 2.18,
          allcb: 9971.8584,
          alljl: 2146.84,
          muDosage: 330.04
        },
        {
          area: 1.35,
          dosage: 651.29,
          useCost: 68.18,
          museCost: 50.52,
          name: '马铃薯',
          nhs: 64,
          yycs: 300,
          pjjl: 4.69,
          allcb: 7899.3072,
          alljl: 754.58,
          muDosage: 482.59
        },
        {
          area: 0.04,
          dosage: 7.97,
          useCost: 1.39,
          museCost: 35.84,
          name: '蔬菜',
          nhs: 28,
          yycs: 162,
          pjjl: 5.79,
          allcb: 7454.72,
          alljl: 426.05,
          muDosage: 204.83
        },
        {
          area: 17.35,
          dosage: 5499.13,
          useCost: 570.76,
          museCost: 32.9,
          name: '水稻',
          nhs: 878,
          yycs: 4953,
          pjjl: 5.64,
          allcb: 197552.985,
          alljl: 19032.94,
          muDosage: 316.97
        },
        {
          area: 40.67,
          dosage: 8566.69,
          useCost: 524.45,
          museCost: 12.89,
          name: '玉米',
          nhs: 1826,
          yycs: 3767,
          pjjl: 2.06,
          allcb: 124485.4328,
          alljl: 20341.63,
          muDosage: 210.63
        }
      ],

      pageInfo: {
        total: 122,
        pageNum: 1,
        pageSize: 15 // 暂时要与组件内的size的第一项一样, 初始值
      },

      drawer: false
    }
  },
  watch: {},
  created() {
    this.chartOpt = this.$eChartFn.testBar({
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'aaaaaaa']
      },
      series: [
        {
          type: 'bar',
          data: [111, 34, 450, 1111, 340, 110, 1111]
        },
        {
          data: [120, 34, 450, 80, 340, 110, 1111],
          type: 'line'
        }
      ]
    })
    console.log(this.chartOpt)
    console.log(this.formData)
  },
  methods: {
    // getFormData(formData) {
    //   this.formData = formData
    // },
    handleConfirm() {
      console.log(this.modelForm)
    },
    handlePageChange(v) {
      this.pageInfo = v
      console.log(this.pageInfo)
    },
    handleAdd(e) {
      // document.querySelector('#model>.el-dialog').style.transformOrigin = `${e.x}px ${e.y}px`
      this.$refs.ZnModel.positioningAnimation(e)
      // document.querySelector(
      //   '#model>.el-dialog'
      // ).style.transformOrigin = `calc(${e.x}px - 50%) calc(${e.y}px - 15vh)`
      const pjjlItem = modelConfig.find((item) => item.prop === 'pjjl')
      pjjlItem && (pjjlItem.isHidden = true)
      // this.modelDefaultInfo = {}
      this.$refs.ZnModel.dialogVisible = true
    },

    handleOperate(row, e) {
      this.$refs.ZnModel.positioningAnimation(e)
      // 控制表单项显示隐藏
      const pjjlItem = modelConfig.find((item) => item.prop === 'pjjl')
      pjjlItem && (pjjlItem.isHidden = false)

      this.modelDefaultInfo = { ...row }
      this.$refs.ZnModel.dialogVisible = true
      console.log(row)
    },

    getMap(mapInstance) {
      this.map = mapInstance
      console.log(pointList)

      map.playTrack({
        map: this.map,
        list: pointList,
        path: require('@/assets/common/img.jpeg'),
        index: 0,
        showLine: true
      })

      map.createPointLayer({
        map: this.map,
        list: pointList,
        path: require('@/assets/common/img.jpeg'),
        layerId: 'pointPayer'
      })

      // map
      //   .query({
      //     url: 'http://59.110.28.240:6080/arcgis/rest/services/nongken/2021nkFarm/MapServer',
      //     id: 0,
      //     where: `FID = 1`
      //   })
      //   .then(res => {
      //     // console.log(res)
      //     map.setEdge({
      //       map: this.map,
      //       feature: res.features[0]
      //     })
      //   })

      // const mapLayer = new esri.layers.ArcGISDynamicMapServiceLayer( //eslint-disable-line
      //   'http://59.110.28.240:6080/arcgis/rest/services/nongken/2021nkFarm/MapServer'
      // )
      // this.map.addLayer(mapLayer)
      // const mapLayer2 = new esri.layers.ArcGISDynamicMapServiceLayer( //eslint-disable-line
      //   'http://59.110.28.240:6080/arcgis/rest/services/hljwlw/hljwlwsdxj/MapServer'
      // )
      // mapLayer2.setVisibleLayers([0, 1])
      // this.map.addLayer(mapLayer2)

      const mapLayer1 = map.createServerLayer({
        url: 'http://59.110.28.240:6080/arcgis/rest/services/nongken/2021nkFarm/MapServer',
        map: this.map,
        op: 0.8,
        layerIndex: 1,
        layerId: 'bbbbb'
      })
      const mapLayer3 = map.createServerLayer({
        url: 'http://59.110.28.240:6080/arcgis/rest/services/nongken/nkjtGdzl/MapServer',
        map: this.map,
        layerIndex: 2,
        layerId: 'ccccc'
      })
      const mapLayer2 = map.createServerLayer({
        url: 'http://59.110.28.240:6080/arcgis/rest/services/hljwlw/hljwlwsdxj/MapServer',
        map: this.map,
        op: 0.8,
        layerArr: [0, 1],
        layerIndex: 1,
        layerId: 'aaaaa'
      })

      // 地图图层获取操作
      // 返回除graphicsLayers(矢量图层) 、 featureLayers(特征图层)外的图层对应的ID数组。
      console.log(this.map.layerIds)
      // 返回graphicsLayers(矢量图层) 、 featureLayers(特征图层)图层对应的ID数组。
      console.log(this.map.graphicsLayerIds)
      // index 指放置图层的位置。最底层的索引为0。
      this.map.reorderLayer(mapLayer3, this.map.layerIds.length)
      // 所有显示的图层
      console.log(this.map.getLayersVisibleAtScale(), mapLayer1, mapLayer2, mapLayer3)
      // 根据id获取图层
      console.log(this.map.getLayer('pointPayer'))
      // console.log(this.map.getLayer('lineLayer'))
      console.log(this.map.layerIds)
    },

    // 点击要素
    mapBlockClick(e) {
      console.log(e)
      map
        .identify({
          map: this.map,
          event: e,
          plantUrl: 'http://59.110.28.240:6080/arcgis/rest/services/nongken/nkjtGdzl/MapServer'
        })
        .then((res) => {
          if (res.length === 0) return console.warn('识别不到要素')
          if (this.edge) {
            this.map.removeLayer(this.edge)
          }
          this.edge = map.setEdge({
            map: this.map,
            feature: res[0].feature,
            color: [0, 0, 255]
          })
        })
    },

    // 点击点位
    mapPointClick(e) {
      if (this.prePoint) {
        const preSymbol = new esri.symbol.PictureMarkerSymbol( // eslint-disable-line
          require('@/assets/common/img.jpeg'),
          18,
          18
        )
        this.prePoint.setSymbol(preSymbol)
      }
      this.prePoint = e
      // e.infoTemplate = new esri.InfoTemplate('aaa', 'bbb') // eslint-disable-line
      this.map.centerAndZoom(e.geometry, 12).then(() => {
        const symbol = new esri.symbol.PictureMarkerSymbol( // eslint-disable-line
          require('@/assets/common/节气5.png'),
          18,
          18
        )
        e.setSymbol(symbol)
        console.log(e)

        const textLayer = map.createTextLayer({
          map: this.map,
          text: 'aaaaaa',
          center: e.geometry
        })
        console.log(textLayer)
      })
    },

    // 测试
    // play() {
    //   console.log('aaa')
    //   map.playTrack({
    //     map: this.map,
    //     list: pointList,
    //     path: require('@/assets/common/节气5.png'),
    //     index: 10
    //   })
    // }
    extent() {
      // test
      // return console.log(this.formData)
      // console.log(this.modelForm.name)
      // this.modelForm.name = 'qqqq'

      const task = this.map.setExtent(this.map.getLayer('aaaaa').initialExtent.expand(0.5))
      task.then(() => {
        console.log('ok')
      })
    },

    // 查看详情
    check() {
      this.drawer = true
    }
  }
}
</script>

<style></style>
