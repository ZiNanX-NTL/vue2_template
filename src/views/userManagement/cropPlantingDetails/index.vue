<!-- eslint-disable -->
<!-- 作物种植情况 -->
<template>
  <div id="">
    <div id="crop">
      <pum-top-search
        @search="getTableList"
        @add="dialog_add"
        :layout="searchLayout"
      ></pum-top-search>
      <div class="app-container">
        <el-card>
          <el-table :data="tableList" style="width: 100%" max-height="700" stripe>
            <el-table-column type="index" width="50"> </el-table-column>
            <!-- 表头 -->
            <el-table-column
              v-for="item in tableTitle"
              :key="item.guid"
              :prop="item.column_name"
              :label="item.column_description"
            >
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="240">
              <template v-slot="scope">
                <el-button type="text" size="small">
                  <span style="padding: 0 5px" @click="setRow(scope.row)">编辑</span>
                  <span style="padding: 0 5px" @click="deleteRow(scope.row)">删除</span>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
    <!-- 添加、编辑弹框 -->
    <set-data-details
      @getNewData="getTableList"
      :title="dialogTitle"
      :editFrom="editFrom"
      :dialogFormVisible="dialogFormVisible"
      ref="dialogForm"
    ></set-data-details>
  </div>
</template>

<script>
/* eslint-disable */
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import PumTopSearch from '../pesticideUserManagement/pumComponents/PumTopSearch' //顶部搜索栏
import setDataDetails from './components/setDataDialog.vue'
import { cropPlantingList, deletCropPlanting } from '@/api/userManagement'
export default {
  //name放入模板名,方便在其他地方引用
  name: '',
  //import引入的组件需要注入到对象中才能使用
  components: {
    PumTopSearch,
    setDataDetails
  },
  data() {
    //这里存放数据
    return {
      searchLayout: ['state', 'time', 'add', 'back'], //搜索栏需要哪些组件
      tableTitle: [
        //表头列表
        { column_description: '户主编号', column_name: 'houseHolder' },
        { column_description: '作物品种', column_name: 'zuoWuLeiXing' },
        { column_description: '作物种类', column_name: 'zuoWuZhongLei' },
        { column_description: '是否为设施作物', column_name: 'sheShiZuoWu' },
        { column_description: '播种日期', column_name: 'sowTime' },
        { column_description: '栽培方式', column_name: 'cultivationPattern' },
        { column_description: '茬数', column_name: 'cropNumber' },
        { column_description: '种植面积', column_name: 'zhongZhiMianJi' },
        { column_description: '施药药械', column_name: 'shiyaojixie' },
        { column_description: '防治次数', column_name: 'preventionNum' }
      ],
      tableList: [
        {
          guid: '9DE7DA62-A4C6-4D1F-BAA4-5DBB753A53CD',
          zuoWuZhongLei: '大豆',
          zhongZhiMianJi: 70,
          shiyaojixie: '背负式机动弥雾机',
          shachongdengmianji: null,
          shachongdengfeiyong: null,
          sebanmianji: null,
          sebanfeiyong: null,
          qitawulimianji: null,
          qitawulifeiyong: null,
          sheShiZuoWu: '',
          createTime: '2021-06-09 10:41:39',
          updateTime: null,
          houseHolder: '2311822021003',
          observeNetId: 'E06C4E36-43DF-4ED7-BAA9-16CAF8495961',
          zuoWuLeiXing: '',
          sowTime: '2021-05-10',
          cultivationPattern: '直播',
          cropNumber: '',
          preventionNum: '1'
        }
      ], //数据列表
      dialogFormVisible: false, //弹框的显示状态
      dialogTitle: '添加',
      editFrom: {} //编辑的数据
    }
  },
  //监听属性 类似于data概念
  computed: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getTableList()
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  //方法集合
  methods: {
    // 查询列表
    getTableList(obj) {
      console.log(obj)
      let query = this.$route.query
      cropPlantingList({
        houseHolder: query.houseHolder,
        startTime: query.startTime,
        endTime: query.endTime,
        pageNum: 1,
        pageSize: 10
      }).then(res => {
        this.tableList = res.records
      })
    },
    // 打开添加弹框
    dialog_add() {
      this.$refs.dialogForm.dialogVisible = true
      this.editFrom = {}
      this.editFrom.houseHolder = this.$route.query.houseHolder
      this.dialogTitle = '添加'
    },
    // 编辑
    setRow(row) {
      this.$refs.dialogForm.dialogVisible = true
      this.editFrom = row
      this.dialogTitle = '编辑'
    },
    // 删除列表项
    deleteRow(row) {
      this.$confirm('该操作将删除此条上报信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deletCropPlanting({
            guid: row.guid
          }).then(res => {
            this.$message({
              message: res || '删除成功！',
              type: 'success'
            })
            this.getTableList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  //监控data中的数据变化
  watch: {},
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated() {}
}
</script>
<style lang="scss" scoped>
/* @import url(); 引入公共css类 */
</style>
