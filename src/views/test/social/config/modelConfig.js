export default [
  {
    label: '作物名称', // label文字
    prop: 'name', // 字段名
    element: 'el-input', // 指定elementui组件
    // initValue: '', // 字段初始值
    clearable: true,
    placeholder: '请输入作物名', // elementui组件属性
    rules: [{ required: true, message: '必填项', trigger: 'blur' }], // elementui组
    events: {
      // elementui组件方法
      input(val) {
        console.log(val)
      }
    }
  },
  {
    label: '调查户数', // label文字
    prop: 'nhs', // 字段名
    element: 'el-input', // 指定elementui组件
    // initValue: '', // 字段初始值
    clearable: true,
    placeholder: '请输入调查户数', // elementui组件属性
    rules: [{ required: true, message: '必填项', trigger: 'blur' }], // elementui组
    events: {
      // elementui组件方法
      input(val) {
        console.log(val)
      }
    }
  },
  {
    isHidden: false,
    label: '平均用药次数', // label文字
    prop: 'pjjl', // 字段名
    element: 'el-input', // 指定elementui组件
    // initValue: '', // 字段初始值
    clearable: true,
    placeholder: '请输入平均用药次数', // elementui组件属性
    rules: [{ required: true, message: '必填项', trigger: 'blur' }], // elementui组
    events: {
      // elementui组件方法
      input(val) {
        console.log(val)
      }
    }
  }
]
