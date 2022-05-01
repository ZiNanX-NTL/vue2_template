<!-- eslint-disable -->
<!-- 用户管理 -->
<template>
  <div class="userManage">
    <pum-top-search
      @search="getTableList"
      :layout="searchLayout"
      @batchRejected="batchRejected"
      :exportIshow="true"
      @exportTable="exportTable"
    ></pum-top-search>
    <div class="app-container">
      <el-card class="wrapper scrollCss">
        <el-table :data="tableList" style="width: 100%" max-height="680" stripe>
          <el-table-column type="index" width="50"> </el-table-column>
          <!-- 表头 -->
          <el-table-column
            v-for="item in tableTitle"
            :key="item.guid"
            :prop="item.column_name"
            :label="item.column_description"
          >
          </el-table-column>
          <el-table-column label="审核状态" prop="stateText" fixed="right">
            <template v-slot="scope">
              <el-button
                type="text"
                size="small"
                :id="scope.row.state == 1 ? 'shenhe_btn_green' : 'shenhe_btn_red'"
              >
                <span style="padding: 0 5px" @click="setStatus(scope.row)">{{
                  scope.row.stateText
                }}</span>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="240">
            <template v-slot="scope">
              <el-button type="text" size="small">
                <span
                  style="padding: 0 5px"
                  @click="
                    () => {
                      cause = ''
                      rejectDialogVisable = true
                      activeRow = scope.row
                    }
                  "
                  v-if="role == 1"
                  >驳回</span
                >
                <span style="padding: 0 5px" @click="setRow(scope.row)">编辑</span>
                <span style="padding: 0 5px" @click="getCropDetails(scope.row)">作物种植</span>
                <span style="padding: 0 5px" @click="getDetails(scope.row)">购买使用</span>
                <span style="padding: 0 5px" @click="deleteRow(scope.row)">删除</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="queryInfo.pageNum"
          :hide-on-single-page="tableList.length == 0"
          :page-sizes="[10, 15, 30, 50, 100]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-card>
    </div>
    <!-- 编辑、添加弹框 -->
    <pum-edit-dialog
      :dialogFormVisible="dialogFormVisible"
      :moduleName="moduleName"
      :title="dialogTitle"
      :editFrom="editFrom"
      ref="dialogForm"
      @submit="saveEdit"
    ></pum-edit-dialog>

    <!-- 驳回弹框 -->
    <el-dialog title="驳回" :visible.sync="rejectDialogVisable" width="30%">
      <el-input v-model="cause" type="textarea" :rows="3" placeholder="请输入驳回理由" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="setRowStatus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import PumTopSearch from './pumComponents/PumTopSearch' //顶部搜索栏
import PumEditDialog from './pumComponents/PumEditDialog' //编辑信息弹框
// import pagination  from "@/components/pagination/index.vue";//分页组件
import {
  tbFindPeasantMessageListData,
  updatePeasantMessage,
  deletPeasantMessage,
  batchRejected,
  messageListDataExcel
} from '@/api/userManagement.js'
export default {
  //name放入模板名,方便在其他地方引用
  name: 'pesticideUserManagement',
  //import引入的组件需要注入到对象中才能使用
  components: {
    // lanTable,
    PumTopSearch,
    PumEditDialog
    // pagination,
  },
  data() {
    //这里存放数据
    return {
      moduleName: 'userManage', //当前模块名
      searchLayout: ['state', 'time', 'batchRejected'], //搜索栏需要哪些组件
      dialogTitle: '编辑用户信息',
      tableTitle: [
        { column_description: '户主名称', column_name: 'peasantName' },
        { column_description: '性別', column_name: 'sex' },
        { column_description: '年齡', column_name: 'age' },
        { column_description: '文化程度', column_name: 'standardOfCulture' },
        { column_description: '家庭人口(个)', column_name: 'family' },
        { column_description: '劳动力(个)', column_name: 'laborForce' },
        { column_description: '耕地面积(亩)', column_name: 'plowlandArea' },
        { column_description: '种植面积(亩次)', column_name: 'plantArea' },
        { column_description: '经济状况', column_name: 'pecuniaryCondition' },
        { column_description: '农户类型', column_name: 'peasantType' },
        { column_description: '地址', column_name: 'address' },
        { column_description: '上报人', column_name: 'observeNetName' },
        { column_description: '上报人电话', column_name: 'telphone' },
        { column_description: '市', column_name: 'city' },
        { column_description: '区县', column_name: 'country' },
        // { column_description: "添加时间", column_name: "createTime" },
        // { column_description: "修改时间", column_name: "updateTime" },
        { column_description: '审核意见', column_name: 'cause' }

        // { column_description: "审核状态", column_name: "stateText" },

        // { column_description: "经度", column_name: "x" },
        // { column_description: "纬度", column_name: "y" },
      ],
      tableList: [], //表格数据
      queryInfo: {
        cityCode: '',
        pageNum: 1,
        pageSize: 10,
        state: ''
      },
      total: 0, //分页-数据总条数
      rejectDialogVisable: false, //驳回弹框的显隐
      dialogFormVisible: false, //添加、编辑 弹框的显示状态
      editFrom: {}, //要修改的数据
      activeRow: {}, //当前点击行的数据
      cause: '' //驳回理由
    }
  },
  //监听属性 类似于data概念
  computed: {},
  beforeRouteEnter(to, from, next) {
    if (from.name === 'buyDetails' || from.name === 'cropPlantingDetails') {
      to.meta.isBack = true
    }
    next()
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    let userInfo = this.$store.state.user.userInfo //登录的用户信息
    this.userInfo = userInfo
    this.queryInfo.cityCode = userInfo.id //行政编号
    this.role = userInfo.role //权限：1-省  2-市  3-区县
    if (this.role == 1) {
      this.queryInfo.state = 1
    }
    // console.log(this.$store.state.user.userInfo);
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getTableList()
  },
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated() {
    if (!this.$route.meta.isBack) {
      this.queryInfo = {
        cityCode: '',
        pageNum: 1,
        pageSize: 10,
        state: ''
      }
      let userInfo = this.$store.state.user.userInfo //登录的用户信息
      this.userInfo = userInfo
      this.queryInfo.cityCode = userInfo.id //行政编号
      this.role = userInfo.role //权限：1-省  2-市  3-区县
      if (this.role == 1) {
        this.queryInfo.state = 1
      }
      this.getTableList()
    }
    this.$route.meta.isBack = false
  },

  methods: {
    //方法集合

    //获取农药用户列表
    getTableList(obj = {}, inquire = false) {
      for (const key in obj) {
        this.queryInfo[key] = obj[key]
        console.log(this.queryInfo[key])
      }
      if (inquire) {
        this.queryInfo.pageNum = 1
      }
      if (this.role == 1) {
        this.queryInfo.state = 1 //省级只能查看审核通过的
      }
      this.queryInfo.cityCode = obj.cityCode || this.userInfo.id //如果筛选条件没有选区县，则地区默认为当前账号的地区

      tbFindPeasantMessageListData(this.queryInfo).then(res => {
        this.total = res.total //设置数据总条数
        // console.log(res.data.Data);
        this.tableList = res.records.map(item => {
          //处理审核字段
          switch (item.state) {
            case 0:
              item.stateText = '待审核'
              break
            case 1:
              item.stateText = '审核通过'
              break
            case 2:
              item.stateText = '已驳回'
              break
            default:
              //默认为审核中
              item.stateText = '审核中'
              break
          }
          return item
        })
      })
    },
    //查看详情
    getDetails(row) {
      console.log(row)
      this.$router.push({
        path: `/userManagement/buyDetails/${row.guid}/${row.state}`
      })
    },
    // 批量驳回
    batchRejected(obj) {
      this.queryInfo = obj
      this.cause = ''
      this.rejectDialogVisable = true
      this.batchRejectedStatus = true //标识是批量驳回
      // batchRejected(obj).then((res) => {
      //   let { Code, Data } = res.data;
      //   if (Code == "0") {
      //     this.$message({
      //       type: "success",
      //       message: "驳回成功!",
      //     });
      //     this.getTableList();
      //     console.log(Data);
      //   } else {
      //     this.$message({
      //       type: "warning",
      //       message: "驳回失败!",
      //     });
      //   }
      // });
    },
    //点击编辑按钮
    setRow(row) {
      this.$refs.dialogForm.dialogVisible = true
      this.editFrom = row

      // console.log(this.editFrom);
    },
    //每一行的驳回功能
    setRowStatus() {
      if (this.batchRejectedStatus) {
        //批量驳回
        this.queryInfo.cause = this.cause
        batchRejected(this.queryInfo).then(res => {
          this.rejectDialogVisable = false
          this.queryInfo = {}
          this.queryInfo.pageSize = 10
          this.queryInfo.pageNum = 1
          this.getTableList()
          console.log(res)
        })
      } else {
        let obj = JSON.parse(JSON.stringify(this.activeRow))
        obj.cause = this.cause
        obj.state = 2 //驳回状态
        updatePeasantMessage(obj).then(res => {
          this.$message({
            message: '驳回成功！',
            type: 'success'
          })
          this.rejectDialogVisable = false
          this.getTableList()
        })
      }
    },
    setStatus(row) {
      if (row.state == 1) return
      this.$confirm('该操作将审核此条上报信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          let obj = row
          obj.state = 1 //审核通过
          updatePeasantMessage(obj).then(res => {
            this.$message({
              message: '审核通过',
              type: 'success'
            })
            this.$refs.dialogForm.dialogVisible = false
            this.getTableList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消审核'
          })
        })
    },
    //提交修改
    saveEdit(val) {
      updatePeasantMessage(val).then(res => {
        this.$message({
          message: res,
          type: 'success'
        })
        this.$refs.dialogForm.dialogVisible = false
        this.$refs.dialogForm.resetForm()
        this.getTableList()
      })
    },
    // 删除列表项
    deleteRow(row) {
      this.$confirm('该操作将删除此条上报信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deletPeasantMessage({
            guid: row.guid
          }).then(res => {
            this.$message({
              message: Data || '删除成功！',
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
    },
    // 跳转至作物种植情况页
    getCropDetails(row) {
      this.$router.push({
        path: `/userManagement/cropPlantingDetails`,
        query: {
          houseHolder: row.guid,
          startTime: this.queryInfo.startTime || '',
          endTime: this.queryInfo.endTime || ''
        }
      })
    },
    //pageSize(每页筛选条数) 改变时会触发
    handleSizeChange(val) {
      this.queryInfo.pageSize = val
      this.queryInfo.pageNum = 1
      this.getTableList()
      console.log(`每页 ${val} 条`)
    },
    //currentPage(当前页码) 改变时会触发
    handleCurrentChange(val) {
      this.queryInfo.pageNum = val
      this.getTableList(this.queryInfo)
      console.log(`当前页: ${val}`)
    },
    //导出
    async exportTable(obj) {
      // this.$loading.show({text:'正在导出中....'})
      console.log(obj)
      const data = await messageListDataExcel(obj)
      console.log(data)
      const blob = new Blob([data], {
        type: 'application/octet-stream;charset=utf-8'
      })
      console.log(blob)
      const fileName = '农药用户管理统计.xls'
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    }
  },
  //监控data中的数据变化
  watch: {}
}
</script>
<style lang="scss" scoped>
/* @import url(); 引入公共css类 */
// .userManage{
// border-left: 1px solid;
// }
#shenhe_btn_red {
  color: #fff;
  background-color: red;
}
#shenhe_btn_green {
  color: #fff;
  background-color: green;
}
</style>
