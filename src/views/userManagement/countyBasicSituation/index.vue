<!-- eslint-disable -->
<template>
  <div class="cbs-container">
    <div class="app-container">
      <el-card class="userDetail">
        <el-row :gutter="20">
          <el-col :span="4" class="label">户主编号：</el-col>
          <el-col :span="8">{{ data.peasantNo }}</el-col>
          <el-col :span="4" class="label">单位全称：</el-col>
          <el-col :span="8">{{ data.unitName }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4" class="label">联系人：</el-col>
          <el-col :span="8">{{ data.linkman }}</el-col>
          <el-col :span="4" class="label">联系地址：</el-col>
          <el-col :span="8">{{ data.address }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4" class="label">联系电话：</el-col>
          <el-col :span="8">{{ data.phone }}</el-col>
          <el-col :span="4" class="label">email:</el-col>
          <el-col :span="8">{{ data.email }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4" class="label">耕地面积：</el-col>
          <el-col :span="8">{{ data.ploughArea }}</el-col>
          <el-col :span="4" class="label">种植面积：</el-col>
          <el-col :span="8">{{ data.plantArea }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4" class="label">作物面积</el-col>
          <el-col :span="8">{{ data.collect }}</el-col>
          <el-col :span="4" class="label"></el-col>
          <el-col :span="8"></el-col>
        </el-row>
        <el-row class="bottom">
          <el-button type="primary" icon="el-icon-edit" @click="toEdit">编辑</el-button>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { mapGetters } from 'vuex'
import { findTbPeasantaudituserData } from '@/api/userManagement.js'
export default {
  //name放入模板名,方便在其他地方引用
  name: '',
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      data: {
        peasantNo: '',
        unitName: '',
        linkman: '',
        address: '',
        phone: '',
        email: '',
        ploughArea: '',
        plantArea: '',
        collect: ''
      }
    }
  },
  //监听属性 类似于data概念
  computed: {
    ...mapGetters(['userId'])
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    findTbPeasantaudituserData({
      peasantNo: this.userId
    }).then(res => {
      if(res){
        this.data = res
      }
      this.data.peasantNo = this.userId
    })
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  //方法集合
  methods: {
    // 编辑
    toEdit() {
      console.log(this.data)
      this.$router.push({
        path: '/userManagement/editUserDetails',
        query: {
          data: JSON.stringify(this.data)
        }
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
.userDetail {
  padding: 20px;
  // 数据注释
  .label {
    color: #a19db1;
  }
  .el-row {
    height: 40px;
    line-height: 40px;
  }
  // 底部-操作栏
  .bottom {
    height: 60px;
    line-height: 60px;
  }
}
</style>
