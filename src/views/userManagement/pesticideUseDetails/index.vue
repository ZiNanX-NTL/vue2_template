<!-- eslint-disable -->
<!-- 农药使用记录 -->
<template>
  <div class="cbs-container">
    <pum-top-search
      @search="getTableList"
      @add="dialog_add"
      :layout="searchLayout"
    ></pum-top-search>
    <div class="app-container">
      <el-card>
        <el-table :data="tableList" style="width: 100%" max-height="700">
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
          <el-table-column label="操作" fixed="right">
            <template v-slot="scope">
              <el-button type="text" size="small">
                <span style="padding: 0 5px" @click="setRow(scope.row)">编辑</span>
                <span style="padding: 0 5px" @click="deleteRow(scope.row)">删除</span>
                <!-- <span style="padding: 0 5px" @click="setRowStatus(scope.row)" v-if="role==1">驳回</span> -->
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageNum"
          :hide-on-single-page="tableList.length == 0"
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
  findPesticidesbuyuse,
  updatePesticidesToModify,
  addPesticideApplication
} from '@/api/userManagement.js'
export default {
  //name放入模板名,方便在其他地方引用
  name: '',
  //import引入的组件需要注入到对象中才能使用
  components: {
    PumTopSearch,
    PumEditDialog
  },
  props: {
    houseHolder: String //户主编号
    // state:Number,//审核状态
  },
  data() {
    //这里存放数据
    return {
      moduleName: 'pesticidesUseRecord', //当前模块名
      searchLayout: ['houseHolder', 'state', 'time', 'add', 'back'], //搜索栏需要哪些组件
      dialogTitle: '编辑使用记录',
      tableTitle: [
        { column_description: '户主编号', column_name: 'houseHolder' },
        { column_description: '施药时间', column_name: 'giveTime' },
        { column_description: '作物种类', column_name: 'cropType' },
        { column_description: '防治面积(亩)', column_name: 'preventionArea' },
        { column_description: '防治对象', column_name: 'preventionObject' },
        { column_description: '农药总用量(克、毫升)', column_name: 'pesticidesDosage' },
        { column_description: '上报人', column_name: 'observeNetName' },
        { column_description: '使用成本(元)', column_name: 'useCost' }
        // { column_description: "添加时间", column_name: "createTime" },
        // { column_description: "修改时间", column_name: "updateTime" },
        // { column_description: "审核状态", column_name: "stateText" },
      ],
      tableList: [], //表格数据
      queryInfo: {
        houseHolder: '',
        pageNum: 1,
        pageSize: 15,
        state: '',
        buyRecordId: '' //农药购买id
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
    if (this.$route.query.buyRecordId) {
      this.queryInfo.buyRecordId = this.$route.query.buyRecordId
    }
    // this.queryInfo.houseHolder=this.$router.query.houseHolder;

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
    getTableList(obj = {}) {
      //查询数据
      if (Object.keys(obj).length > 0) {
        //更新查询条件
        for (const key in obj) {
          this.queryInfo[key] = obj[key]
        }
      }
      console.log(obj)
      this.queryInfo.state = ''
      findPesticidesbuyuse(this.queryInfo).then(res => {
        this.total = res.total //设置数据总条数
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
        console.log(this.tableList)
      })
    },
    //修改用户信息
    setRow(row) {
      console.log(row)
      this.dialogTitle = '编辑使用记录'
      this.editFrom = row
      this.$refs.dialogForm.dialogVisible = true
    },
    saveEdit(val) {
      //提交修改
      console.log(val)
      updatePesticidesToModify(val).then(res => {
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
      this.$confirm('该操作将删除此条使用记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deletPeasantMessage({
            guid: row.guid
          }).then(res => {
            let { Code, Data, Desc } = res.data
            console.log(res)
            if (Code == '0') {
              this.$message({
                message: Data || '删除成功！',
                type: 'success'
              })
              this.getTableList()
            } else {
              this.$message({
                message: Desc || '删除失败！',
                type: 'error'
              })
            }
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
    //   updatePesticidesToModify(obj).then(res=>{
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
    //驳回功能
    setRowStatus(row) {
      this.$confirm('该操作将驳回此条上报信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = row
          data.state = 2 //驳回状态
          updatePesticidesToModify(data).then(res => {
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
    // 打开添加使用记录弹框
    dialog_add() {
      this.dialogTitle = '添加使用记录'
      this.$refs.dialogForm.dialogVisible = true
      this.editFrom = {
        pdNo: 'PD',
        houseHolder: this.$route.query.houseHolder
      }
      console.log(this.$refs.dialogForm.form)
    },
    // 添加农药使用记录
    addTableItem(val) {
      let obj = val
      obj.buyRecordId = this.$route.query.buyRecordId
      addPesticideApplication(obj).then(res => {
        this.$message({
          message: res || '添加成功！',
          type: 'success'
        })
        this.getTableList()
        this.$refs.dialogForm.resetForm()
        this.$refs.dialogForm.dialogVisible = false
      })
    },
    //pageSize(每页筛选条数) 改变时会触发
    handleSizeChange(val) {
      this.queryInfo.pageSize = val
      this.queryInfo.pageNum = 1
      this.getTableList()
    },
    //currentPage(当前页码) 改变时会触发
    handleCurrentChange(val) {
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
