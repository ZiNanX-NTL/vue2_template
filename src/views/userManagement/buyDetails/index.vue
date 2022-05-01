<!-- eslint-disable -->
<!-- 农药管理 -->
<template>
  <div class="buyDetails-container">
    <pum-top-search
      @search="getTableList"
      @add="dialog_add"
      :layout="searchLayout"
    ></pum-top-search>
    <div class="app-container">
      <el-card>
        <el-table :data="tableList" style="width: 100%" max-height="670">
          <!-- 表头 -->
          <el-table-column
            v-for="item in tableTitle"
            :key="item.guid"
            :prop="item.column_name"
            :label="item.column_description"
          >
          </el-table-column>
          <!-- <el-table-column label="审核状态" prop="stateText" fixed="right">
        <template v-slot="scope">
          <el-button type="text" size="small" :id="scope.row.state==1?'shenhe_btn_green':'shenhe_btn_red'">
            <span style="padding: 0 5px" >{{scope.row.stateText}}</span>
          </el-button>
        </template>
      </el-table-column> -->
          <el-table-column label="操作" fixed="right" width="200">
            <template v-slot="scope">
              <el-button type="text" size="small">
                <span style="padding: 0 5px" @click="setRow(scope.row)">编辑</span>
                <span style="padding: 0 5px" @click="deleteRow(scope.row)">删除</span>
                <!-- <span style="padding: 0 5px" @click="setRowStatus(scope.row)" v-if="role==1">驳回</span> -->
                <span style="padding: 0 5px" @click="getUseDetails(scope.row)"
                  >查看农药使用详情</span
                >
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :hide-on-single-page="tableList.length == 0"
          :current-page="queryInfo.pageNum"
          :page-sizes="[5, 10, 15, 30, 50, 100]"
          :page-size="this.queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-card>
    </div>
    <pum-edit-dialog
      :moduleName="moduleName"
      @add="addTableItem"
      :title="dialogTitle"
      :editFrom="editFrom"
      ref="dialogForm"
      @submit="saveEdit"
    ></pum-edit-dialog>
  </div>
</template>

<script>
/* eslint-disable */
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import PumTopSearch from '../pesticideUserManagement/pumComponents/PumTopSearch' //顶部搜索栏
import PumEditDialog from '../pesticideUserManagement/pumComponents/PumEditDialog' //编辑信息弹框
import {
  findPesticidesbuyrecord,
  updatePesticidesbuyrecord,
  addPesticidesbuyrecord,
  deletPurchase
} from '@/api/userManagement'
export default {
  //name放入模板名,方便在其他地方引用
  name: '',
  //import引入的组件需要注入到对象中才能使用
  components: {
    PumTopSearch,
    PumEditDialog
  },
  props: {
    houseHolder: String
    // state:Number,
  },
  data() {
    //这里存放数据
    return {
      moduleName: 'pesticidesBuyRecord', //当前模块名
      searchLayout: ['state', 'time', 'add', 'back'], //搜索栏需要哪些组件
      dialogTitle: '编辑购买记录',
      tableTitle: [
        { column_description: '户主编号', column_name: 'houseHolder' },
        { column_description: '登记号', column_name: 'pdNo' },
        { column_description: '通用名', column_name: 'pdName' },
        { column_description: '购买日期', column_name: 'buyTime' },
        { column_description: '农药购买数量', column_name: 'buyNum' },
        { column_description: '购买费用', column_name: 'buyCost' },
        { column_description: '上报人', column_name: 'observeNetName' },
        { column_description: '农药单价', column_name: 'unitPrice' },
        // { column_description: "添加时间", column_name: "createTime" },
        // { column_description: "修改时间", column_name: "updateTime" },
        { column_description: '农药规格', column_name: 'spec' }
        // { column_description: "审核状态", column_name: "stateText" },
      ],
      tableList: [], //表格数据
      queryInfo: {
        houseHolder: '',
        pageNum: 1,
        pageSize: 15,
        state: ''
      },
      total: 0, //分页-数据总条数
      editFrom: {},
      dialogFormVisible: false //弹框的显示状态
    }
  },
  //监听属性 类似于data概念
  computed: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.queryInfo.houseHolder = this.$route.params.houseHolder
    console.log(this.queryInfo.houseHolder);
    let userInfo = this.$store.state.user.userInfo //登录的用户信息
    this.queryInfo.cityCode = userInfo.id //行政编号
    this.role = userInfo.role //权限：1-省  2-市  3-区县
    if (this.role == 1) {
      this.queryInfo.state = 1
    }
    this.getTableList()
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  //方法集合
  methods: {
    //查询数据列表
    getTableList(obj = {}) {
      //obj是顶部筛选栏
      if (Object.keys(obj).length > 0) {
        //更新查询条件
        for (const key in obj) {
          this.queryInfo[key] = obj[key]
        }
      }
      this.queryInfo.state = ''
      findPesticidesbuyrecord(this.queryInfo).then(res => {
        this.total = res.total //设置数据总条数
        this.tableList = res.records.map(item => {
          //处理审核字段
          switch (item.state) {
            case 0:
              item.stateText = '审核中'
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
          console.log(this.tableList)
          return item
        })
      })
    },
    //打开编辑购买信息弹框
    setRow(row) {
      this.$refs.dialogForm.dialogVisible = true
      this.dialogTitle = '编辑购买记录'
      this.editFrom = row
      console.log(this.editFrom)
    },
    // 打开添加购买记录弹框
    dialog_add() {
      this.$refs.dialogForm.dialogVisible = true
      this.dialogTitle = '添加购买记录'
      this.editFrom = {
        pdNo: 'PD',
        houseHolder: this.$route.params.houseHolder
      }
      console.log(this.$route.params);
      // console.log(this.editFrom)
    },
    // 添加购买记录
    addTableItem(obj) {
      addPesticidesbuyrecord(obj).then(res => {
        this.$message({
          message: res || '添加成功！',
          type: 'success'
        })
        this.getTableList()
        this.$refs.dialogForm.resetForm()
        this.$refs.dialogForm.dialogVisible = false
      })
    },
    getUseDetails(row) {
      //查看农药使用记录
      this.$router.push({
        path: '/userManagement/pesticideUseDetails',
        query: {
          buyRecordId: row.guid,
          houseHolder: row.houseHolder
        }
      })
    },
    saveEdit(val) {
      //提交修改
      updatePesticidesbuyrecord(val).then(res => {
        this.$message({
          message: res,
          type: 'success'
        })
        this.$refs.dialogForm.dialogVisible = false
        this.$refs.dialogForm.resetForm()
        this.getTableList()
      })
    },
    // 删除购买记录
    deleteRow(row) {
      this.$confirm('该操作将删除此条购买记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deletPurchase({
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
    },
    // 审核功能
    // setStatus(row){
    //   if(row.state==1)return
    //   let obj = row;
    //   obj.state=1;//审核通过
    //   updatePesticidesbuyrecord(obj).then(res=>{
    //     if(res.data.Code=="0"){
    //       this.$message({
    //         message: '审核通过',
    //         type: "success",
    //       });
    //       this.$refs.dialogForm.dialogVisible=false;
    //       this.$refs.dialogForm.resetForm();
    //       this.getTableList()
    //     }else{
    //       this.$message({
    //         message: "审核失败！",
    //         type: "error",
    //       });
    //     }
    //   })
    // },
    setRowStatus(row) {
      //驳回功能
      this.$confirm('该操作将驳回此条上报信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = row
          data.state = 2 //驳回状态
          updatePesticidesbuyrecord(data).then(res => {
            this.$message({
              message: '驳回成功！',
              type: 'success'
            })
            this.getTableList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消驳回'
          })
        })
    },
    handleSizeChange(val) {
      //pageSize(每页筛选条数) 改变时会触发
      this.queryInfo.pageSize = val
      this.queryInfo.pageNum = 1
      this.getTableList()
    },
    handleCurrentChange(val) {
      //currentPage(当前页码) 改变时会触发
      this.queryInfo.pageNum = val
      this.getTableList()
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
#shenhe_btn_red {
  color: #fff;
  background-color: red;
}
#shenhe_btn_green {
  color: #fff;
  background-color: green;
}
</style>
