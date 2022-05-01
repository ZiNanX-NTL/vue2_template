<!-- eslint-disable -->
<template>
  <div id="nzw">
    <el-dialog
      :title="title + '农作物种植情况'"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="form" status-icon ref="ruleForm" :rules="rules">
        <!-- 农作物种植信息 -->
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="户主编号"
              :label-width="formLabelWidth"
              prop="houseHolder"
            >
              <el-input
                v-model="form.houseHolder"
                placeholder="请输入户主编号"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="作物种类"
              :label-width="formLabelWidth"
              prop="zuoWuZhongLei"
            >
              <el-select
                v-model="form.zuoWuZhongLei"
                placeholder="请选择作物种类"
              >
                <el-option
                  v-for="item in zuoWuZhongLeiList"
                  :key="item.cropName"
                  :label="item.cropName"
                  :value="item.cropName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.zuoWuZhongLei=='中草药'||form.zuoWuZhongLei=='经济作物'||form.zuoWuZhongLei=='蔬菜'||form.zuoWuZhongLei=='瓜果'">
            <el-form-item
              label="作物品种"
              :label-width="formLabelWidth"
              prop="zuoWuLeiXing"
            >
              <el-input
                v-model="form.zuoWuLeiXing"
                placeholder="请输入作物品种"
              ></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="12" v-if="form.zuoWuZhongLei=='蔬菜'||form.zuoWuZhongLei=='瓜果'">
            <el-form-item
              label="是否为设施作物"
              :label-width="formLabelWidth"
              prop="sheShiZuoWu"
            >
              <el-select
                v-model="form.sheShiZuoWu"
                placeholder="请选择是否为设施作物"
              >
                <el-option
                  v-for="item in sheShiZuoWuList"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="播种日期"
              :label-width="formLabelWidth"
              prop="sowTime"
            >
              <el-date-picker
                style="width: 100%"
                :clearable="true"
                class="borderR4 white_bac"
                v-model="form.sowTime"
                type="datetime"
                placeholder="请选择播种日期"
                size="small"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="栽培方式"
              :label-width="formLabelWidth"
              prop="cultivationPattern"
            >
              <el-select
                v-model="form.cultivationPattern"
                placeholder="请选择栽培方式"
              >
                <el-option
                  v-for="item in cultivationPatternList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.zuoWuZhongLei=='中草药'||form.zuoWuZhongLei=='经济作物'||form.zuoWuZhongLei=='蔬菜'||form.zuoWuZhongLei=='瓜果'">
            <el-form-item
              label="茬数"
              :label-width="formLabelWidth"
              prop="cropNumber"
            >
              <el-select v-model="form.cropNumber" placeholder="请选择茬数">
                <el-option
                  v-for="item in cropNumberList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="种植面积"
              :label-width="formLabelWidth"
              prop="zhongZhiMianJi"
            >
              <el-input
                v-model="form.zhongZhiMianJi"
                placeholder="请输入种植面积"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="施药药械"
              :label-width="formLabelWidth"
              prop="shiyaojixie"
            >
              <el-select
                v-model="form.shiyaojixie"
                placeholder="请选择作物类型"
              >
                <el-option
                  v-for="item in shiyaojixieList"
                  :key="item.cropName"
                  :label="item.cropName"
                  :value="item.cropName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="防治次数"
              :label-width="formLabelWidth"
              prop="preventionNum"
            >
              <el-input
                v-model="form.preventionNum"
                placeholder="请输入防治次数"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">保存</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import {
  cropNameList,
  saveCropPlanting,
  updataCropPlanting,
} from "@/api/userManagement.js";
import {parseTime} from "@/utils/index.js"
export default {
  //name放入模板名,方便在其他地方引用
  name: "",
  //import引入的组件需要注入到对象中才能使用
  props: {
    dialogFormVisible: Boolean,
    title: String,
    editFrom: Object,
  },
  components: {},
  data() {
    //这里存放数据
    return {
      formLabelWidth: "125px",
      form: {
        houseHolder: "", //户主编号
        zuoWuLeiXing: "", //作物品种
        zuoWuZhongLei: "", //作物种类
        sowTime: "", //播种日期
        cultivationPattern: "", //栽培方式
        cropNumber: "", //茬数
        zhongZhiMianJi: "", //种植面积
        shiyaojixie: "", //施药药械
        preventionNum: "", //防治次数
        sheShiZuoWu:'',//是否为设施作物
      },
      zuoWuZhongLeiList: [], //作物类型下拉数据
      shiyaojixieList: [], //施药药械下拉数据
      sheShiZuoWuList:[
        {
          value:'是',
        },
        {
          value:'否',
        }
      ],
      cropNumberList: [
        //茬数下拉数据
        {
          label: "第一茬",
        },
        {
          label: "第二茬",
        },
        {
          label: "第三茬",
        },
        {
          label: "第四茬",
        },
      ],
      dialogVisible: false,
      cultivationPatternList: [
        //栽培方式
        {
          label: "移栽",
        },
        {
          label: "直播",
        },
      ],
      rules: {
        // houseHolder:{ required: true, message: '请输入户主编号', trigger: 'blur' },
        zuoWuLeiXing: {
          required: true,
          message: "请选择作物种类",
          trigger: "blur",
        },
        zuoWuZhongLei: {
          required: true,
          message: "请输入作物种类",
          trigger: "blur",
        },
        sowTime: { required: true, message: "请选择播种日期", trigger: "blur" },
        cultivationPattern: {
          required: true,
          message: "请选择栽培方式",
          trigger: "blur",
        },
        cropNumber: {
          required: true,
          message: "请选择种植茬数",
          trigger: "blur",
        },
        zhongZhiMianJi: {
          required: true,
          message: "请输入种植面积",
          trigger: "blur",
        },
        shiyaojixie: {
          required: true,
          message: "请选择施药药械",
          trigger: "blur",
        },
        preventionNum: {
          required: true,
          message: "请输入防治次数",
          trigger: "blur",
        },
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getCropNameList();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  //方法集合
  methods: {
    //获取作物种类/施药药械
    getCropNameList() {
      cropNameList({
        typeName: "作物种类",
      }).then((res) => {
          this.zuoWuZhongLeiList = res;
      });

      cropNameList({
        typeName: "施药药械",
      }).then((res) => {
          this.shiyaojixieList = res;
      });
    },
    submit() {
      this.$refs.ruleForm.validate((boolean) => {
          console.log(this.form);
          this.form.sowTime= parseTime(this.form.sowTime)
        if (boolean) {
          if (this.title.includes("添加")) {
            saveCropPlanting(this.form).then((res) => {
                this.$message({
                  message: res || "添加成功！",
                  type: "success",
                });
                this.dialogVisible = false;
                this.$emit("getNewData", {});
            });
          } else if (this.title.includes("编辑")) {
            updataCropPlanting(this.form).then((res) => {
                this.$message({
                  message: res || "编辑成功！",
                  type: "success",
                });
                this.dialogVisible = false;
                this.$emit("getNewData", {});
            });
          }
        }
      });
    },
  },
  //监控data中的数据变化
  watch: {
    dialogFormVisible(nv, ov) {
      this.dialogVisible = nv;
      console.log(nv);
      return nv;
    },
    editFrom(nv, ov) {
      this.form = JSON.parse(JSON.stringify(this.editFrom));
      return nv;
    },
  },
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated() {},
};
</script>
<style lang='scss'>
/* @import url(); 引入公共css类 */
#nzw{
  .el-input__inner,.el-input--small{
      width: 260px !important;
  }
  .el-dialog{
      min-width: 900px;
  }
}
</style>