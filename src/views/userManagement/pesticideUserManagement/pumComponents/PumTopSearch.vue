<!-- eslint-disable -->
<template>
  <div class="search-container">
    <div class="app-container">
      <el-card class="wrapper">
        <el-form>
          <el-row type="flex" align="middle" :gutter="10">
            <el-col :span="2" v-if="layout.includes('time')"> 开始时间： </el-col>
            <el-col :span="3" v-if="layout.includes('time')">
              <el-date-picker
                style="width: 100%"
                :clearable="true"
                class="borderR4 white_bac"
                v-model="sizeTopValue.startTime"
                type="datetime"
                placeholder="请选择开始时间"
                size="small"
                @change="changeStartTime"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-col>
            <el-col :span="2" v-if="layout.includes('time')"> 结束时间： </el-col>
            <el-col :span="3" v-if="layout.includes('time')">
              <el-date-picker
                style="width: 100%"
                size="small"
                :clearable="true"
                class="borderR4 white_bac"
                v-model="sizeTopValue.endTime"
                type="datetime"
                placeholder="请选择结束时间"
                @change="changeEndTime"
                :picker-options="pickerOptions1"
              ></el-date-picker>
            </el-col>
            <template
              v-if="userInfo.role == 1 && $route.path == '/userManagement/pesticideUserManagement'"
            >
              <el-col :span="3">
                <el-select
                  v-model="city"
                  :clearable="true"
                  placeholder="请选择市"
                  @change="getCountry"
                >
                  <el-option
                    v-for="item in cityList"
                    :key="item.id"
                    :label="item.area"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="3">
                <el-select v-model="country" :clearable="true" placeholder="请选择区县">
                  <el-option
                    v-for="item in countryList"
                    :key="item.id"
                    :label="item.area"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </template>
            <el-col :span="3" v-if="layout.includes('state') && userInfo.role !== 1">
              <el-select v-model="sizeTopValue.state" clearable placeholder="请选择审核状态">
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <template v-if="!layout.includes('back')">
              <el-col :span="6">
                <el-row>
                  <el-col :span="8">用户名称：</el-col>
                  <el-col :span="16"
                    ><el-input
                      placeholder="请输入姓名"
                      v-model="sizeTopValue.peasantName"
                      clearable
                      @clear="handleClear"
                  /></el-col>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-col :span="8">上报人电话：</el-col>
                  <el-col :span="16"
                    ><el-input
                      placeholder="请输入电话"
                      v-model="sizeTopValue.Telphone"
                      clearable
                      @clear="handleClear"
                  /></el-col>
                </el-row>
              </el-col>
            </template>
            <el-col :span="4">
              <el-row type="flex" align="middle">
                <el-button type="primary" @click="getTableData">查询</el-button>
                <el-button
                  type="primary"
                  @click="batchRejected"
                  v-if="userInfo.role == 1 && layout.includes('batchRejected')"
                  >批量驳回</el-button
                >
                <el-button type="primary" @click="addTableData" v-if="layout.includes('add')"
                  >新增</el-button
                >
                <el-button type="primary" @click="exportTable" v-if="exportIshow">导出</el-button>
              </el-row>
            </el-col>
            <el-col :span="2" v-if="layout.includes('back')">
              <el-button type="primary" @click="back">返回上一级</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { findPeasantMessageListData } from '@/api/userManagement.js'
import { parseTime } from '@/utils/index.js'
export default {
  //name放入模板名,方便在其他地方引用
  name: '',
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    layout: Array,
    exportIshow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    //这里存放数据
    return {
      userInfo: {},
      sizeTopValue: {
        //筛选栏数据
        startTime: '', //开始时间
        endTime: '', //结束时间
        state: '', //审核状态 默认审核中
        peasantName: '', //姓名
        Telphone: '' // 电话
      },
      city: '', //市行政编码
      country: '', //区县行政编码
      cityList: [], //市数据
      countryList: [], //区县数据
      statusList: [
        {
          label: '审核中',
          value: 0
        },
        {
          label: '审核通过',
          value: 1
        },
        {
          label: '已驳回',
          value: 2
        }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  //监听属性 类似于data概念
  computed: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    console.log(this.layout.includes('batchRejected'))
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.userInfo = this.$store.state.user.userInfo
    this.role = this.userInfo.role
    if (this.userInfo.role == 1) {
      //为省级用户时，查询辖区内的市列表
      findPeasantMessageListData({ parentId: this.userInfo.id }).then(res => {
        this.cityList = res //获取并设置市列表的值
      })
    }
  },
  //方法集合
  methods: {
    // 清除姓名或电话
    handleClear() {
      this.getTableData()
    },

    //查询-获取表格数据
    getTableData() {
      if (!this.changeEndTime()) return false
      console.log(this.userInfo)
      // if(this.role!==1){
      //   this.cityCode==this.userInfo.id
      //   console.log();
      // }
      console.log(this.country, this.city)
      let startTime = parseTime(this.sizeTopValue.startTime)
      let endTime = parseTime(this.sizeTopValue.endTime)
      let obj = {
        startTime,
        endTime,
        state: this.userInfo.role == 1 ? 1 : this.sizeTopValue.state,
        cityCode: this.country || this.city,
        peasantName: this.sizeTopValue.peasantName,
        Telphone: this.sizeTopValue.Telphone
      }
      if (this.userInfo.role !== 1) {
        obj.cityCode = this.userInfo.id
        console.log(obj.cityCode)
      }
      console.log(obj)
      this.$emit('search', obj, true)
    },
    // 批量驳回
    batchRejected() {
      let startTime = parseTime(this.sizeTopValue.startTime)
      let endTime = parseTime(this.sizeTopValue.endTime)
      let obj = {
        cityCode: this.country || this.city,
        startTime,
        endTime,
        state: 1
      }
      if (startTime == '' || endTime == '') {
        this.$message({
          message: '开始或结束时间不能为空！',
          type: 'warning'
        })
        return false
      }
      if (this.country == '' || endTime == '') {
        //市县都为必选
        this.$message({
          message: '市县选项不能为空！',
          type: 'warning'
        })
        return false
      }
      this.$emit('batchRejected', obj)
      // this.$confirm('此操作将驳所有符合当前筛选条件的上报, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消驳回'
      //   });
      // });
    },
    //添加
    addTableData() {
      this.$emit('add', {})
    },
    //导出
    exportTable() {
      let startTime = parseTime(this.sizeTopValue.startTime)
      let endTime = parseTime(this.sizeTopValue.endTime)
      let obj = {
        startTime,
        endTime,
        state: this.userInfo.role == 1 ? 1 : this.sizeTopValue.state,
        cityCode: this.country || this.city
      }
      if (this.userInfo.role !== 1) {
        obj.cityCode = this.userInfo.id
        console.log(obj.cityCode)
      }
      if (this.userInfo.role == 1 && this.city == '' && this.country == '') {
        obj.cityCode = this.userInfo.id
      }
      this.$emit('exportTable', obj)
    },
    //开始时间改变事件
    changeStartTime() {
      const { startTime, endTime } = this.sizeTopValue
      this.pickerOptions1 = {
        disabledDate(time) {
          //大于当前时间,小于开始时间时禁用
          return time.getTime() > Date.now() || new Date(startTime).getTime() > time.getTime()
        }
      }
      if (endTime && new Date(startTime).getTime() > new Date(endTime).getTime()) {
        //结束时间不为空且结束时间小于开始时间
        this.$message({
          message: '警告，请选择正确的开始时间和结束时间',
          type: 'warning'
        })
      }
    },
    // 结束时间改变事件
    changeEndTime() {
      const { startTime, endTime } = this.sizeTopValue
      if (new Date(startTime).getTime() > new Date(endTime).getTime()) {
        this.$message({
          message: '警告，请选择正确的开始时间和结束时间',
          type: 'warning'
        })
        return false
      }
      return true
    },
    //改变市时获取区县数据
    getCountry(val) {
      this.country = ''
      findPeasantMessageListData({ parentId: this.city }).then(res => {
        console.log(res)
        this.countryList = res //获取并设置市列表的值
      })
    },
    // 返回上一级
    back() {
      this.$router.back()
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
.el-row {
  padding-top: 5px;
  padding-bottom: 5px;
  .el-col {
    text-align: center;
    font-size: 14px;
    line-height: 40px;
  }
  .el-select {
    padding-left: 15px;
  }
}
</style>
