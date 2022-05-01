<!-- eslint-disable -->
<!-- 修改信息弹框 -->
<template>
  <div id="">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="form" status-icon ref="ruleForm" :rules="rules">
        <!-- 用户管理 -->
        <el-row>
          <template v-if="moduleName == 'userManage'">
            <el-col :span="12">
              <el-form-item label="户主名称" :label-width="formLabelWidth" prop="peasantName">
                <el-input
                  v-model="form.peasantName"
                  placeholder="请输入户主名称"
                  :clearable="true"
                  :disabled="false"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
                <el-radio-group v-model="form.sex" :disabled="false">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年龄" :label-width="formLabelWidth" prop="age">
                <el-input
                  v-model.number="form.age"
                  placeholder="请输入年龄"
                  :clearable="true"
                  :disabled="false"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文化程度" :label-width="formLabelWidth" prop="standardOfCulture">
                <el-select v-model="form.standardOfCulture" placeholder="请选择文化程度">
                  <el-option
                    v-for="item in standardOfCultureList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="家庭人口(个)" :label-width="formLabelWidth" prop="family">
                <el-input
                  v-model.number="form.family"
                  placeholder="请输入家庭人口数量"
                  :clearable="true"
                  :disabled="false"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="劳动力(个)" :label-width="formLabelWidth" prop="laborForce">
                <el-input
                  v-model.number="form.laborForce"
                  placeholder="请输入劳动力人数"
                  :clearable="true"
                  :disabled="false"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="耕地面积(亩)" :label-width="formLabelWidth" prop="plowlandArea">
                <el-input
                  v-model="form.plowlandArea"
                  placeholder="请输入耕地面积"
                  :clearable="true"
                  :disabled="false"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="种植面积(亩次)" :label-width="formLabelWidth" prop="plantArea">
                <el-input
                  v-model="form.plantArea"
                  placeholder="请输入种植面积"
                  :clearable="true"
                  :disabled="false"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="农户类型" :label-width="formLabelWidth" prop="peasantType">
                <el-select v-model="form.peasantType" placeholder="请选择农户类型">
                  <el-option
                    v-for="item in peasantTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="经济状况"
                :label-width="formLabelWidth"
                prop="pecuniaryCondition"
              >
                <el-select v-model="form.pecuniaryCondition" placeholder="请选择经济情况">
                  <el-option
                    v-for="item in pecuniaryConditionList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <!-- 农药购买记录模块 -->
          <template v-if="moduleName == 'pesticidesBuyRecord'">
            <el-col :span="12">
              <el-form-item label="登记号" :label-width="formLabelWidth" prop="pdNo">
                <el-autocomplete
                  class="inline-input"
                  style="width: 80%"
                  v-model="form.pdNo"
                  value-key="pdno"
                  :fetch-suggestions="pdNoChange"
                  :trigger-on-focus="false"
                  @select="handleSelect"
                  placeholder="请输入登记号"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="通用名" :label-width="formLabelWidth" prop="pdName">
                <el-input
                  v-model="form.pdName"
                  placeholder="通用名"
                  :clearable="true"
                  :disabled="false"
                  :readonly="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="农药购买数量" :label-width="formLabelWidth" prop="buyNum">
                <el-input
                  v-model.number="form.buyNum"
                  placeholder="请输入农药购买数量"
                  :clearable="true"
                  :disabled="false"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="购买费用" :label-width="formLabelWidth" prop="buyCost">
                <el-input
                  v-model="form.buyCost"
                  placeholder="请输入购买费用"
                  :clearable="true"
                  :disabled="false"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="农药规格" :label-width="formLabelWidth" prop="spec">
                <!-- <el-input
                  v-model="form.spec"
                  placeholder="请输入农药规格"
                  :clearable="true"
                  :disabled="false"
                ></el-input> -->
                <el-select v-model="form.spec" placeholder="请选择农药规格">
                  <el-option
                    v-for="item in specList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <!-- 农药使用记录 -->
          <template v-if="moduleName == 'pesticidesUseRecord'">
            <el-col :span="12">
              <el-form-item label="作物种类" :label-width="formLabelWidth" prop="cropType">
                <!-- <el-input
                  v-model="form.cropType"
                  placeholder="请输入作物种类"
                  :clearable="true"
                  :disabled="false"
                ></el-input> -->
                <el-select v-model="form.cropType" placeholder="请选择作物种类">
                  <el-option
                    v-for="item in cropTypeList"
                    :key="item.zuoWuZhongLei"
                    :label="item.zuoWuZhongLei"
                    :value="item.zuoWuZhongLei"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="防治面积(亩)"
                :label-width="formLabelWidth"
                prop="preventionArea"
              >
                <el-input
                  v-model="form.preventionArea"
                  placeholder="请输入防治面积"
                  :clearable="true"
                  :disabled="false"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="防治对象" :label-width="formLabelWidth" prop="preventionObject">
                <el-input
                  v-model="form.preventionObject"
                  placeholder="请输入防治对象"
                  :clearable="true"
                  :disabled="false"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="农药总用量(g/ml)"
                :label-width="formLabelWidth"
                prop="pesticidesDosage"
              >
                <el-input
                  v-model="form.pesticidesDosage"
                  placeholder="请输入农药总用量"
                  :clearable="true"
                  :disabled="false"
                ></el-input>
              </el-form-item>
            </el-col>
          </template>

          <!-- 公用部分 -->
          <el-col
            :span="12"
            v-if="moduleName == 'pesticidesBuyRecord' || moduleName == 'pesticidesUseRecord'"
          >
            <el-form-item label="户主编号" :label-width="formLabelWidth" prop="houseHolder">
              <el-input
                :value="form.houseHolder"
                placeholder="户主编号"
                :clearable="false"
                :disabled="false"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="moduleName == 'userManage'">
            <el-form-item label="地址" :label-width="formLabelWidth" prop="address">
              <el-input
                v-model="form.address"
                autocomplete="off"
                placeholder="请输入地址"
                :clearable="true"
                :disabled="false"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="moduleName == 'pesticidesBuyRecord'">
            <el-form-item label="购买时间" :label-width="formLabelWidth" prop="buyTime">
              <el-date-picker
                style="width: 100%"
                :clearable="true"
                :disabled="false"
                class="borderR4 white_bac"
                v-model="form.buyTime"
                type="datetime"
                placeholder="请选择购买时间"
                size="small"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="moduleName == 'pesticidesUseRecord'">
            <el-form-item label="施药时间" :label-width="formLabelWidth" prop="giveTime">
              <el-date-picker
                style="width: 100%"
                :clearable="true"
                :disabled="false"
                class="borderR4 white_bac"
                v-model="form.giveTime"
                type="datetime"
                placeholder="请选择施药时间"
                size="small"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12" v-if="moduleName == 'pesticidesUseRecord'">
            <el-form-item
              label="使用成本(元)"
              :label-width="formLabelWidth"
              prop="useCost"
            >
              <el-input
                v-model="form.useCost"
                placeholder="请输入使用成本"
                :clearable="true"
                :disabled="userInfo.role == 3 && stateBoolean"
              ></el-input>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12">
            <el-form-item
              label="审核状态"
              :label-width="formLabelWidth"
              prop="state"
            >
              <el-select
                v-model="form.state"
                :clearable="true"
                placeholder="请选择审核状态"
                :disabled="userInfo.role !== 1 && stateBoolean"
              >
                <el-option
                  v-for="item in statusList"
                  :key="newSymbol()"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <template v-if="!(userInfo.role == 3 && stateBoolean)">
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submit">保存</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
// :disabled="userInfo.role==3&& stateBoolean"

//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 form '《组件路径》';
import { pdNoPdName, houseHolder } from '@/api/userManagement.js'
import { parseTime } from '@/utils/index.js'
export default {
  //name放入模板名,方便在其他地方引用
  name: '',
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    dialogFormVisible: Boolean,
    moduleName: String, //要处理的表格的名字
    editFrom: Object, //修改的内容
    title: String //弹框标题
  },
  data() {
    //这里存放数据
    // 自定义年龄验证
    let checkeAge = (rule, value, callback) => {
      if (!value) {
        callback(new Error('年龄不能为空！'))
      } else if (typeof value !== 'number') {
        callback(new Error('年龄只能为数字'))
      } else if (value < 0 || value > 200) {
        callback(new Error('年龄大小有误！请核实后重新输入'))
      } else {
        callback()
      }
    }
    let checkFamily = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('家庭人口数量不能为空！'))
      } else if (typeof value !== 'number' || value < 0) {
        return callback(new Error('年龄只能为正整数'))
      } else if (Number(this.form.laborForce) > Number(value)) {
        return callback(new Error('家庭人口数不能少于劳动力'))
      } else {
        callback()
      }
    }
    let checkPlowlandArea = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('耕地面积不能为空！'))
      } else if (Number.isNaN(Number(value))) {
        return callback(new Error('耕地面积只能为数字！'))
      }
      //  else if (Number(this.form.plantArea) > Number(value)) {
      //   return callback(new Error("耕地面积不能小于种植面积"));
      // }
      else {
        callback()
      }
    }
    let checkPlantArea = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('种植面积不能为空！'))
      } else if (Number.isNaN(Number(value))) {
        return callback(new Error('种植面积只能为数字！'))
      }
      // else if (Number(value) > Number(this.form.plowlandArea)) {
      //   return callback(new Error("种植面积不能大于耕地面积！"));
      // }
      else {
        this.$refs.ruleForm.validateField('plowlandArea') //验证通过时触发耕地面积的验证函数
        callback()
      }
    }
    let checkLaborForce = (rule, value, callback) => {
      if (!value) {
        callback(new Error('劳动力数量不能为空！'))
      } else if (typeof value !== 'number' || value < 0) {
        callback(new Error('劳动力个数只能为正整数'))
      } else if (Number(this.form.family) < Number(value)) {
        callback(new Error('劳动力数量不能大于家庭人口'))
      } else {
        this.$refs.ruleForm.validateField('family') //验证通过时触发家庭人口的验证函数
        callback()
      }
    }
    let checkBuyNum = (rule, value, callback) => {
      if (!value) {
        callback(new Error('购买数量不能为空！'))
      } else if (typeof value !== 'number' || value < 0) {
        callback(new Error('购买数量只能为正整数'))
      } else {
        callback()
      }
    }
    let checkBuyCost = (rule, value, callback) => {
      if (!value) {
        callback(new Error('购买费用不能为空！'))
      } else if (!this.form.buyNum) {
        callback(new Error('购买数量不能为空'))
      } else if (Number(value) / this.form.buyNum > 5) {
        callback(new Error('购买费用不能大于购买数量*5'))
      } else {
        callback()
      }
    }
    // let checkcropType =(rule,value,callback) => {
    //   if(!value){
    //     callback(new Error("作物种类不能为空"))
    //   }else{
    //     callback();
    //   }
    // };
    let checkpreventionArea = (rule, value, callback) => {
      if (!value) {
        callback(new Error('防治面积不能为空'))
      } else if (Number(value) < 0) {
        callback(new Error('防治面积不能为负数'))
      } else {
        callback()
      }
    }
    let checkpreventionObject = (rule, value, callback) => {
      if (!value) {
        callback(new Error('防治对象不能为空'))
      } else {
        callback()
      }
    }
    let checkpesticidesDosage = (rule, value, callback) => {
      if (!value) {
        callback(new Error('农药总用量不能为空！'))
      } else if (Number(value) < 0) {
        callback(new Error('农药总用量不能为负数'))
      } else {
        callback()
      }
    }
    // let checkhouseHolder=(rule,value,callback)=>{
    //   if(!value){
    //     callback(new Error("用户编号不能为空"))
    //   }else{
    //     callback();
    //   }
    // }
    return {
      userInfo: {
        //当前登录的用户的数据
      },
      form: {
        sex: '男', //性别 默认为男
        pdNo: 'PD', //登记号数据
      },
      rules: {
        age: [{ validator: checkeAge, trigger: 'blur' }],
        family: [
          //家庭人口数量
          { validator: checkFamily, trigger: 'blur' }
        ],
        plowlandArea: [
          //耕地面积
          { validator: checkPlowlandArea, trigger: 'blur' }
        ],
        plantArea: [
          //种植面积
          { validator: checkPlantArea, trigger: 'blur' }
        ],
        laborForce: [
          //劳动力数量
          { validator: checkLaborForce, trigger: 'blur' }
        ],
        buyNum: [{ validator: checkBuyNum, trigger: 'blur' }],
        buyCost: [
          //购买费用
          { validator: checkBuyCost, trigger: 'blur' }
        ],
        // cropType:[{validator:checkcropType,trigger:"blur"}],
        preventionArea: [{ validator: checkpreventionArea, trigger: 'blur' }],
        preventionObject: [{ validator: checkpreventionObject, trigger: 'blur' }],
        pesticidesDosage: [{ validator: checkpesticidesDosage, trigger: 'blur' }]
        // houseHolder:[{validator:checkhouseHolder,trigger:"blur"}]
      },
      formLabelWidth: '125px',
      dialogVisible: false,
      stateBoolean: false, //审核状态 审核中或已驳回为false 通过为true
      cropTypeList: [], //作物种类列表
      statusList: [
        //审核状态下拉框数据
        {
          label: '审核中',
          value: 0
        },
        {
          label: '审核通过',
          value: 1
        }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      // pickerOptions1: {
      //   disabledDate(time) {
      //     return time.getTime() > Date.now();
      //   },
      // },
      pecuniaryConditionList: [
        {
          label: '较差',
          value: '较差'
        },
        {
          label: '中等',
          value: '中等'
        },
        {
          label: '好',
          value: '好'
        }
      ],
      // 农户类型
      peasantTypeList: [
        {
          label: '普通农户',
          value: '普通农户'
        },
        {
          label: '种植大户',
          value: '种植大户'
        },
        {
          label: '农民合作社',
          value: '农民合作社'
        },
        {
          label: '专业化组织',
          value: '专业化组织'
        }
      ],
      // 文化程度下拉框
      standardOfCultureList: [
        {
          label: '小学',
          value: '小学'
        },
        {
          label: '初中',
          value: '初中'
        },
        {
          label: '高中',
          value: '高中'
        },
        {
          label: '中专',
          value: '中专'
        },
        {
          label: '大专',
          value: '大专'
        },
        {
          label: '本科',
          value: '本科'
        },
        {
          label: '硕士',
          value: '硕士'
        },
        {
          label: '博士',
          value: '博士'
        }
      ],
      //农药规格
      specList: [
        {
          label: '克',
          value: '克'
        },
        {
          label: 'ml',
          value: 'ml'
        }
      ]
    }
  },
  //监听属性 类似于data概念
  computed: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    console.log(this.form);
    console.log(this.editFrom)
    this.userInfo = this.$store.state.user.userInfo //当前登录的用户的信息
    if (JSON.stringify(this.editFrom) !== '{}') {
      this.form = this.editFrom
    }
    this.form.houseHolder = this.$route.params.houseHolder
    //审核状态为审核中或审核通过时
    // if(this.form.state==0||this.form.state==1){
    //   this.stateBoolean = Boolean(this.form.state);//用于处理表单的禁用状态，审核通过时，县级不可修改数据
    // }
    // // 审核状态为已驳回时，县级可以修改数据
    // if(this.form.state==2){
    //   this.stateBoolean=false;
    // }
    // console.log(this.form, this.userInfo.role == 3, this.stateBoolean);
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  //方法集合
  methods: {
    //提交事件
    submit() {
      // if (!this.changeUpdateTime()) return false;
      //验证整个表单，全部表单项合法才能提交
      this.$refs.ruleForm.validate(boolean => {
        if (boolean) {
          // 处理时间格式
          if (this.form.buyTime) {
            this.form.buyTime = parseTime(this.form.buyTime)
          }
          // this.form.createTime = parseTime(this.form.createTime);
          // this.form.updateTime = parseTime(this.form.updateTime);
          this.form.giveTime = parseTime(this.form.giveTime)
          if (this.title.includes('添加')) {
            this.$emit('add', this.form)
          } else {
            this.$emit('submit', this.form)
          }
        }
      })
    },
    resetForm() {
      //表单重置
      this.$refs['ruleForm'].resetFields()
    },
    // 开始时间改变事件
    // changeCreateTime() {
    //   const { createTime, updateTime } = this.form;
    //   this.pickerOptions1 = {
    //     //大于当前时间,小于开始时间时禁用
    //     disabledDate(time) {
    //       return (
    //         time.getTime() > Date.now() ||
    //         new Date(createTime).getTime() > time.getTime()
    //       );
    //     },
    //   };
    //   if (
    //     updateTime &&
    //     new Date(createTime).getTime() > new Date(updateTime).getTime()
    //   ) {
    //     //结束时间不为空且结束时间小于开始时间
    //     this.$message({
    //       message: "警告，请选择正确的开始时间和结束时间",
    //       type: "warning",
    //     });
    //   }
    // },
    // changeUpdateTime() {
    //   const { createTime, updateTime } = this.form;
    //   if (
    //     createTime &&
    //     updateTime &&
    //     new Date(createTime).getTime() > new Date(updateTime).getTime()
    //   ) {
    //     this.$message({
    //       message: "警告，请选择正确的开始时间和结束时间",
    //       type: "warning",
    //     });
    //     return false;
    //   }
    //   return true;
    // },
    // 农药购买记录-登记号模糊查询-匹配通用名
    pdNoChange(val, cb) {
      // if(val.length<3){
      //   console.log(val);
      //   cb([])
      //   return false
      // }
      pdNoPdName({ pdNo: val }).then(res => {
        cb(res)
      })
    },
    // 选中建议项时
    handleSelect(row) {
      this.form.pdNo = row.pdno.split('/')[0]
      this.form.pdName = row.pdno.split('/')[1]
    },
    newSymbol() {
      // 返回新的Symbol用作唯一键
      return Symbol()
    }
    // handleClose(done){
    //   // this.form={}
    //   this.resetForm();
    //   // console.log(this);
    //   this.dialogFormVisible=false;
    //   done()
    // }
  },
  //监控data中的数据变化
  watch: {
    // dialogFormVisible(nv, ov) {
    //   console.log(nv);
    //   this.dialogVisible = nv;
    //   return nv;
    // },
    dialogVisible: {
      handler(nv, ov) {
        console.log(nv)
        this.dialogVisible = nv
        this.form = this.editFrom
        console.log(this.form)
        return nv
      }
    },
    editFrom: {
      handler(nv, ov) {
        if (this.moduleName == 'pesticidesUseRecord') {
          //农药使用记录
          houseHolder({
            houseHolder: this.$route.query.houseHolder
          }).then(res => {
              this.cropTypeList = res
              console.log(res);
          }).catch(err => {
            this.$message({
                message: Desc || '获取种植作物类型失败！',
                type: 'error'
              })
          })
        }
        if (JSON.stringify(this.editFrom) !== '{}') {
          this.form = JSON.parse(JSON.stringify(this.editFrom))
        } else {
          this.form = {
            pdNo: 'PD',
            houseHolder: this.$route.params.houseHolder
          }
        }
        this.form.houseHolder = this.$route.params.houseHolder
        // if(this.form.state==0||this.form.state==1){
        //   this.stateBoolean = Boolean(this.form.state);//用于处理表单的禁用状态，审核通过时，县级不可修改数据
        // }
        // 审核状态为已驳回时，县级可以修改数据
        // if(this.form.state==2){
        //   this.stateBoolean=false;
        // }
        return nv
      },
      deep: true
    },
    'form.state': {
      handler(nv, ov) {
        if (this.form.state == 2 && this.statusList.length < 3) {
          this.statusList = [
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
          ]
        } else {
          this.statusList = [
            {
              label: '审核中',
              value: 0
            },
            {
              label: '审核通过',
              value: 1
            }
          ]
        }
      },
      immediate: true
    }
  },
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated() {}
}
</script>
<style lang="scss" scoped>
/* @import url(); 引入公共css类 */
.el-col,
.el-form {
  .el-date-picker,
  .el-select {
    width: 80% !important;
  }
  .el-col {
    height: 51px;
    .el-input {
      width: 80% !important;
    }
  }
}
</style>
