<!-- eslint-disable -->
<!-- 编辑用户区县信息 -->
<template>
  <div class="eud-container">
    <div class="app-container">
      <el-card class="wrapper">
        <el-form
          :model="form"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="单位全称" prop="unitName">
            <el-input v-model="form.unitName"></el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="address">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="linkman" class="link">
            <el-input v-model="form.linkman"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone" class="link">
            <el-input v-model.number="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="email" prop="email" class="link">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="耕地面积" prop="ploughArea" class="area">
            <el-input v-model="form.ploughArea"></el-input> 万亩
          </el-form-item>
          <el-form-item label="种植面积" prop="plantArea" class="area">
            <el-input v-model="form.plantArea"></el-input> 万亩次
          </el-form-item>
          <el-form-item label="作物面积">
            <!-- 作物面积列表 -->
            <div>
              <p class="collect_item" v-for="(item, index) in collectList" :key="item.id">
                <span class="text"
                  >{{ item.cropType }}种植面积 {{ item.plantArea }}万亩 大户比例占{{
                    item.rich || 0
                  }}%
                </span>
                <span class="delete_btn" @click="delete_collectItem(index)">
                  <i class="el-icon-close"></i>
                </span>
              </p>
              <p class="collect_add">
                <el-select v-model="cropType" placeholder="作物种类">
                  <el-option
                    v-for="item in cropTypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
                <el-input v-model="plantArea" placeholder="种植面积/万亩"></el-input>
                <el-input v-model="rich" placeholder="大户比例%"></el-input>
                <span class="collect_add_btn" @click="add_collect">
                  <i class="el-icon-plus"></i>
                </span>
              </p>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button @click="submit">保存</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { savePeasantaudituser, findDictionarydata } from '@/api/userManagement.js'
export default {
  //name放入模板名,方便在其他地方引用
  name: '',
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      form: {
        address: '', //地址
        collect: '', //作物面积
        guid: '', //主键
        linkman: '', //联系人
        peasantNo: '', //户主编号
        phone: '', //联系电话
        email: '',
        plantArea: '', //种植面积
        ploughArea: '', //耕地面积
        remark: '', //备注
        unitName: '' //单位全称
      },
      //是否点击添加
      num: 0,
      collectList: [
        //作物面积列表
        //   {
        //     cropType: '',
        //     plantArea: '',
        //     rich: '',
        //   }
      ],
      cropType: '', //作物种类
      cropTypeList: [
        {
          label: '水稻',
          value: '水稻'
        }
      ], //作物种类列表
      plantArea: '', //添加作物面积---种植面积
      rich: '', //添加作物面积--大户比例
      rules: {
        unitName: [{ required: true, message: '单位全称不能为空！', trigger: 'blur' }],
        address: [{ required: true, message: '活动地址不能为空！', trigger: 'blur' }],
        linkman: [{ required: true, message: '联系人不能为空！', trigger: 'blur' }],
        phone: [
          {
            pattern: /^1[23456789]\d{9}$/,
            message: '手机号格式错误！',
            trigger: 'blur'
          },
          { required: true, message: '联系电话不能为空！', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱地址不能为空！', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        ploughArea: [{ required: true, message: '耕地面积不能为空！', trigger: 'blur' }],
        plantArea: [{ required: true, message: '种植面积不能为空！', trigger: 'blur' }]
      }
    }
  },
  //监听属性 类似于data概念
  computed: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    console.log(this.$route);
    let data = this.$route.query.data
    if (data) {
      this.form = JSON.parse(data)
    }
    //   处理作物面积数据
    this.collectList = []
    let collect = []
    if (this.form.collect != '') {
      collect = this.form.collect.split(',')
    }
    console.log(collect)
    for (let i = 0; i < collect.length; i++) {
      let item = collect[i].slice(1, collect[i].length - 2).split('|')
      this.collectList.push({
        cropType: item[0],
        plantArea: item[1],
        rich: item[2],
        id: this.createSymbol()
      })
    }
    console.log(this.collectList)

    // 查询作物种类列表
    findDictionarydata().then(res => {
        this.cropTypeList = res
    })
    console.log(this.collectList)
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  //方法集合
  methods: {
    resetForm(formName) {
      console.log(this.form)
      // this.$refs[formName].resetFields();
      for (let i in this.form) {
        if (i != 'peasantNo') {
          this.form[i] = ''
        }
      }
      this.collectList = []
    },
    //添加作物面积
    add_collect() {
      let type = this.collectType()
      console.log(type)
      if (type) {
        //   验证通过后，向作物面积列表内追加值
        this.collectList.push({
          cropType: this.cropType,
          plantArea: this.plantArea,
          rich: this.rich,
          id: this.createSymbol()
        })
        // 清空添加作物面积操作栏
        this.cropType = ''
        this.plantArea = ''
        this.rich = ''
      } else {
        return false
      }
    },
    // 删除作物面积列表项
    delete_collectItem(index) {
      console.log(index)
      this.collectList.splice(index, 1)
      console.log(this.collectList)
    },
    submit() {
      //  if (this.collectList.length > 0) {
      //             this.form.collect = JSON.stringify(this.collectList);
      //           } else {
      //             this.$message({
      //               message: "作物面积不能为空",
      //               type: "warning",
      //             });
      //             return false;
      //           }
      this.$refs.ruleForm.validate(boolean => {
        if (boolean) {
          //判断是否为编辑状态 且不新增作物面积
          if (
            this.collectList.length > 0 &&
            this.cropType == '' &&
            this.plantArea == '' &&
            this.rich == ''
          ) {
            this.form.collect = JSON.stringify(this.collectList)
            // 清空添加作物面积操作栏
            this.cropType = ''
            this.plantArea = ''
            this.rich = ''
            savePeasantaudituser(this.form).then(res => {
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                })
                setTimeout(() => {
                  this.$router.push({
                    path: '/userManagement/countyBasicSituation'
                  })
                }, 800)
            })
          } else {
            //1.编辑状态下，若新增作物面积 需满足作物面积验证条件 2.新增状态下，需满足验证条件，才进行数据添加
            //作物类型、种植面积、大户占比均不为空（可以为0）
            let type = this.collectType()
            if (type) {
              this.collectList.push({
                cropType: this.cropType,
                plantArea: this.plantArea,
                rich: this.rich,
                id: this.createSymbol()
              })
              this.form.collect = JSON.stringify(this.collectList)
              // 清空添加作物面积操作栏
              this.cropType = ''
              this.plantArea = ''
              this.rich = ''
              savePeasantaudituser(this.form).then(res => {
                  this.$message({
                    message: '编辑成功',
                    type: 'success'
                  })
                  setTimeout(() => {
                    this.$router.push({
                      path: '/userManagement/countyBasicSituation'
                    })
                  }, 800)
              })
            } else {
              return false
            }
          }
        } else {
          this.$message({
            message: '表单信息填写有误！',
            type: 'warning'
          })
        }
      })
    },
    createSymbol() {
      return Symbol()
    },
    //判断作物面积是否为空
    collectType() {
      //作物类型、种植面积、大户占比均不为空（可以为0）
      if (
        !this.cropType ||
        (!this.plantArea && !Object.is(this.plantArea, 0)) ||
        (!this.rich && !Object.is(this.rich, 0))
      ) {
        this.$message({
          message: '作物类型、种植面积、大户占比均不能为空！',
          type: 'warning'
        })
        return false
      } else if (isNaN(this.plantArea)) {
        this.$message({
          message: '种植面积只能填写数字！',
          type: 'warning'
        })
        return false
      } else if (isNaN(this.rich)) {
        this.$message({
          message: '大户占比只能填写数字！',
          type: 'warning'
        })
        return false
      } else if (!isNaN(this.rich) && (this.rich < 0 || this.rich > 100)) {
        this.$message({
          message: '大户占比只能为0~100间的数字',
          type: 'warning'
        })
        return false
      } else {
        return true
      }
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
.wrapper {
  padding: 25px 0;
  .el-form {
    width: 80%;
  }
  // 作物面积列表项
  .collect_item {
    // width: 80%;
    height: 35px;
    box-sizing: border-box;
    line-height: 35px;
    margin-bottom: 10px;
    display: flex;
    color: #c0c4cc;
    .text {
      // min-width: 80%;
      flex: 1;
      text-align: center;
      height: 100%;
      border: 1px solid #f2f2f2;
    }
    .delete_btn {
      width: 40px;
      text-align: center;
      border: 1px solid #f2f2f2;
      margin-left: 3%;
    }
  }
  // 添加作物面积操作栏
  .collect_add {
    margin-top: 20px;
    width: 80%;
    height: 35px;
    line-height: 35px;
    display: flex;
    justify-content: space-around;
    .el-select,
    .el-input {
      width: 25%;
    }
    .collect_add_btn {
      width: 40px;
      font-size: 13px;
      text-align: center;
      border: 1px solid #f2f2f2;
      cursor: pointer;
      i {
        font-weight: 700;
      }
    }
  }
  //   联系方式
  .link {
    .el-input {
      max-width: 850px;
    }
  }
  //   耕地、种植面积
  .area {
    .el-input {
      max-width: 180px;
    }
  }
}
</style>
